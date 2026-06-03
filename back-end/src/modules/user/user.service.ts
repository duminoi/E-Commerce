import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: { addresses: true } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmail(data.email!);
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async findByRefreshToken(token: string, userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: { addresses: true } });
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  // ── Address management ──

  async findAddresses(userId: string): Promise<Address[]> {
    return this.addressRepository.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'DESC' } });
  }

  async createAddress(userId: string, data: Partial<Address>): Promise<Address> {
    const count = await this.addressRepository.count({ where: { userId } });
    const address = this.addressRepository.create({ userId, isDefault: count === 0, ...data });
    return this.addressRepository.save(address);
  }

  async updateAddress(userId: string, id: string, data: Partial<Address>): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Không tìm thấy địa chỉ');
    Object.assign(address, data);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, id: string): Promise<void> {
    const result = await this.addressRepository.delete({ id, userId });
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy địa chỉ');
  }

  async setDefaultAddress(userId: string, id: string): Promise<Address> {
    await this.addressRepository.update({ userId }, { isDefault: false });
    const address = await this.addressRepository.findOne({ where: { id, userId } });
    if (!address) throw new NotFoundException('Không tìm thấy địa chỉ');
    address.isDefault = true;
    return this.addressRepository.save(address);
  }
}
