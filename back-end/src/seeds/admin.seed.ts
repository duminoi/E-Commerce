import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const existingAdmin = await userService.findByEmail('admin@ecommerce.com');
  if (!existingAdmin) {
    await userService.create({
      email: 'admin@ecommerce.com',
      password: await bcrypt.hash('admin123', 12),
      fullName: 'Quản trị viên',
      role: Role.ADMIN,
    });
    console.log('Admin user created: admin@ecommerce.com / admin123');
  } else {
    console.log('Admin user already exists');
  }

  await app.close();
}

bootstrap();
