import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  getUploadDir(): string {
    return join(process.cwd(), 'uploads');
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('Không có file nào được upload');
    return `/uploads/${file.filename}`;
  }

  async removeFile(filename: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
