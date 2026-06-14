import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  private googleClientIds: string[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    const clientId = this.configService.get<string>('google.clientId');
    this.googleClient = new OAuth2Client(clientId);
    if (clientId) {
      this.googleClientIds = [clientId];
    }
  }

  async register(dto: RegisterDto): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
    });

    const tokens = await this.generateTokens(user);
    return { ...tokens, user };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const tokens = await this.generateTokens(user);
    return { ...tokens, user };
  }

  /**
   * Verify a Google ID token, then find-or-create the user and return our own JWT pair.
   * This is the recommended SPA flow: the front-end gets an id_token from Google
   * Identity Services and sends it to the backend for verification.
   */
  async googleLogin(idToken: string): Promise<{ accessToken: string; refreshToken: string; user: User; isNewUser: boolean }> {
    if (!idToken) {
      throw new BadRequestException('Thiếu Google idToken');
    }

    let payload: { sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string };
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientIds.length ? this.googleClientIds : undefined,
      });
      payload = ticket.getPayload() as typeof payload;
    } catch (err) {
      throw new UnauthorizedException('Google token không hợp lệ hoặc đã hết hạn');
    }

    if (!payload.email) {
      throw new BadRequestException('Tài khoản Google không có email');
    }
    if (payload.email_verified === false) {
      throw new UnauthorizedException('Email Google chưa được xác minh');
    }

    const { user, created } = await this.userService.findOrCreateByEmail({
      email: payload.email,
      fullName: payload.name || payload.email.split('@')[0],
      avatar: payload.picture,
    });

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const tokens = await this.generateTokens(user);
    return { ...tokens, user, isNewUser: created };
  }

  async refreshToken(refreshTokenStr: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenStr },
      relations: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (new Date() > storedToken.expiresAt) {
      await this.refreshTokenRepository.remove(storedToken);
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    await this.refreshTokenRepository.remove(storedToken);

    const tokens = await this.generateTokens(storedToken.user);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ userId });
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpires') as any,
    });

    const refreshTokenStr = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpires') as any,
    });

    const refreshExpires = new Date();
    refreshExpires.setDate(refreshExpires.getDate() + 7);

    await this.refreshTokenRepository.save({
      userId: user.id,
      token: refreshTokenStr,
      expiresAt: refreshExpires,
    });

    return { accessToken, refreshToken: refreshTokenStr };
  }
}
