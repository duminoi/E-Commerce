# E-Commerce Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng nền tảng E-Commerce Single Vendor full-stack với NestJS + React để học các khái niệm Node.js framework.

**Architecture:** Monorepo với `back-end/` (NestJS API) và `front-end/` (React SPA). NestJS phục vụ REST API trên port 3000, React dev server trên port 5173 với Vite proxy API sang back-end. PostgreSQL + Redis chạy qua Docker.

**Tech Stack:** NestJS, TypeScript, PostgreSQL, TypeORM, Redis, JWT, React, Vite, TailwindCSS, Zustand, Socket.IO

---

## File Structure

### Giai đoạn 1: Khởi tạo + Auth

```
back-end/
├── src/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── enums/
│   │       └── role.enum.ts
│   └── modules/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/
│       │   │   └── jwt.strategy.ts
│       │   ├── dto/
│       │   │   ├── register.dto.ts
│       │   │   ├── login.dto.ts
│       │   │   ├── refresh-token.dto.ts
│       │   │   └── forgot-password.dto.ts
│       │   └── entities/
│       │       └── refresh-token.entity.ts
│       └── user/
│           ├── user.module.ts
│           ├── user.controller.ts
│           ├── user.service.ts
│           ├── dto/
│           │   ├── update-user.dto.ts
│           │   ├── create-address.dto.ts
│           │   └── update-address.dto.ts
│           └── entities/
│               ├── user.entity.ts
│               └── address.entity.ts
├── uploads/
├── .env
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── package.json

front-end/
├── src/
│   ├── api/
│   │   ├── axios.config.ts
│   │   └── auth.api.ts
│   ├── store/
│   │   └── auth.store.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Toast.tsx
│   ├── pages/
│   │   ├── home/
│   │   │   └── HomePage.tsx
│   │   └── auth/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   ├── router/
│   │   ├── AppRouter.tsx
│   │   └── ProtectedRoute.tsx
│   ├── types/
│   │   ├── api.type.ts
│   │   └── user.type.ts
│   ├── utils/
│   │   └── constants.ts
│   ├── index.css
│   ├── App.tsx
│   └── main.tsx
├── .env
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json

docker-compose.yml
.gitignore
```

---

## GIAI ĐOẠN 1: Khởi tạo dự án + Xác thực
**Khái niệm NestJS**: Module, Controller, Provider, Dependency Injection, Entity, Repository, Guard, Pipe, Strategy

---

### Task 1.1: Khởi tạo môi trường Docker + Git

**Files:**
- Create: `docker-compose.yml`
- Create: `.gitignore`

- [ ] **Step 1: Tạo docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: ecommerce_db
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ecommerce
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: ecommerce_redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

- [ ] **Step 2: Tạo .gitignore**

```
node_modules/
dist/
uploads/
.env
*.log
```

- [ ] **Step 3: Khởi động Docker và Git**

Chạy: `docker-compose up -d`
Tạo git: `git init; git add .; git commit -m "chore: init project with docker-compose"`

---

### Task 1.2: Khởi tạo NestJS Backend

**Files:**
- Create: `back-end/` project qua Nest CLI

- [ ] **Step 1: Tạo NestJS project**

```bash
cd F:\Projects\E-Commerce
npm install -g @nestjs/cli
nest new back-end --package-manager npm --skip-git --language ts
```

Chọn npm khi được hỏi.

- [ ] **Step 2: Cài đặt dependencies cho back-end**

```bash
cd back-end
npm install @nestjs/config @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/throttler
npm install bcrypt class-validator class-transformer
npm install @nestjs/swagger
npm install -D @types/bcrypt @types/passport-jwt
```

- [ ] **Step 3: Xóa các file mặc định không cần thiết**

Xóa: `src/app.controller.ts`, `src/app.controller.spec.ts`, `src/app.service.ts`

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: init NestJS backend with dependencies"
```

---

### Task 1.3: Cấu hình Backend (Env, Database, JWT, App)

**Files:**
- Create: `back-end/.env`
- Create: `back-end/.env.example`
- Create: `back-end/src/config/database.config.ts`
- Create: `back-end/src/config/jwt.config.ts`
- Create: `back-end/src/config/redis.config.ts`
- Create: `back-end/src/config/app.config.ts`
- Modify: `back-end/src/app.module.ts`

- [ ] **Step 1: Tạo .env và .env.example**

`back-end/.env`:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce

JWT_ACCESS_SECRET=dev-access-secret-change-in-production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES=7d

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

VNPAY_TMN_CODE=your-tmn-code
VNPAY_HASH_SECRET=your-hash-secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/result

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email
MAIL_PASS=your-app-password
```

`back-end/.env.example`: nội dung giống `.env` nhưng không có giá trị thật.

- [ ] **Step 2: Tạo config files**

`back-end/src/config/database.config.ts`:
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce',
}));
```

`back-end/src/config/jwt.config.ts`:
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
}));
```

`back-end/src/config/redis.config.ts`:
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
}));
```

`back-end/src/config/app.config.ts`:
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
}));
```

- [ ] **Step 3: Cập nhật AppModule**

`back-end/src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, redisConfig, appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get('app.nodeEnv') !== 'production',
        logging: configService.get('app.nodeEnv') === 'development',
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

- [ ] **Step 4: Kiểm tra kết nối database**

```bash
cd back-end
npm run start:dev
```

Kiểm tra console không có lỗi, NestJS log "Nest application successfully started".

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add backend config (database, jwt, redis, app)"
```

---

### Task 1.4: Entity User và Address

**Files:**
- Create: `back-end/src/common/enums/role.enum.ts`
- Create: `back-end/src/modules/user/entities/user.entity.ts`
- Create: `back-end/src/modules/user/entities/address.entity.ts`

- [ ] **Step 1: Tạo Role enum**

`back-end/src/common/enums/role.enum.ts`:
```typescript
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

- [ ] **Step 2: Tạo User entity**

`back-end/src/modules/user/entities/user.entity.ts`:
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../../common/enums/role.enum';
import { Address } from './address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

- [ ] **Step 3: Tạo Address entity**

`back-end/src/modules/user/entities/address.entity.ts`:
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  phone: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  ward: string;

  @Column()
  detail: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

- [ ] **Step 4: Kiểm tra**

Chạy `npm run start:dev` — bảng `users` và `addresses` sẽ được TypeORM tự tạo trong PostgreSQL.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add User and Address entities"
```

---

### Task 1.5: User Module (Service + Controller cơ bản)

**Files:**
- Create: `back-end/src/modules/user/user.service.ts`
- Create: `back-end/src/modules/user/user.module.ts`
- Create: `back-end/src/modules/user/user.controller.ts`
- Create: `back-end/src/modules/user/dto/update-user.dto.ts`

- [ ] **Step 1: Tạo UserService**

`back-end/src/modules/user/user.service.ts`:
```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
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
}
```

- [ ] **Step 2: Tạo UpdateUserDto**

`back-end/src/modules/user/dto/update-user.dto.ts`:
```typescript
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
```

- [ ] **Step 3: Tạo UserModule**

`back-end/src/modules/user/user.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

- [ ] **Step 4: Tạo UserController (tạm thời có GET /users/me)**

`back-end/src/modules/user/user.controller.ts`:
```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }
}
```

Lưu ý: `@CurrentUser` và `JwtAuthGuard` sẽ được tạo ở các task sau. Hiện tại file này sẽ báo lỗi import — đó là bình thường. Chúng ta sẽ sửa khi tạo đầy đủ.

- [ ] **Step 5: Import UserModule vào AppModule**

Sửa `back-end/src/app.module.ts`, thêm:
```typescript
import { UserModule } from './modules/user/user.module';

// trong imports array, thêm:
UserModule,
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add User module with service, controller, DTO"
```

---

### Task 1.6: JWT Strategy + Guards + Decorators

**Files:**
- Create: `back-end/src/modules/auth/strategies/jwt.strategy.ts`
- Create: `back-end/src/common/guards/jwt-auth.guard.ts`
- Create: `back-end/src/common/decorators/current-user.decorator.ts`
- Create: `back-end/src/common/decorators/public.decorator.ts`

- [ ] **Step 1: Tạo JWT Strategy (Passport)**

`back-end/src/modules/auth/strategies/jwt.strategy.ts`:
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.userService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Tài khoản không hợp lệ hoặc đã bị khóa');
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
```

**Giải thích**: Passport Strategy là pattern xác thực của NestJS. Khi một request có header `Authorization: Bearer <token>`, Passport sẽ tự động gọi `validate()` để giải mã token và tìm user. Kết quả trả về từ `validate()` sẽ được gắn vào `request.user`. Nếu token không hợp lệ hoặc user không tồn tại, Passport tự động throw 401.

- [ ] **Step 2: Tạo JwtAuthGuard**

`back-end/src/common/guards/jwt-auth.guard.ts`:
```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
```

**Giải thích**: Guard này kế thừa `AuthGuard('jwt')` của Passport. Nó kiểm tra metadata `IS_PUBLIC_KEY` được gắn bởi `@Public()` decorator — nếu có, bỏ qua xác thực. Reflector là công cụ đọc metadata từ decorator trong NestJS.

- [ ] **Step 3: Tạo @Public() decorator**

`back-end/src/common/decorators/public.decorator.ts`:
```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Giải thích**: `SetMetadata` gắn metadata vào route handler. JwtAuthGuard dùng Reflector để đọc metadata này. Đây là pattern metadata-based programming của NestJS — decorator gắn dữ liệu, guard/interceptor đọc dữ liệu đó để quyết định hành vi.

- [ ] **Step 4: Tạo @CurrentUser() decorator**

`back-end/src/common/decorators/current-user.decorator.ts`:
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user?.[data];
    }
    return request.user;
  },
);
```

**Giải thích**: `createParamDecorator` tạo custom decorator cho tham số controller. Nó trích xuất `request.user` (được gắn bởi JwtStrategy.validate()). Có thể dùng `@CurrentUser()` để lấy cả object user, hoặc `@CurrentUser('email')` để lấy riêng email.

- [ ] **Step 5: Đăng ký JwtAuthGuard làm global guard trong AppModule**

Sửa `back-end/src/app.module.ts`, thêm provider:
```typescript
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// trong providers array, bên cạnh ThrottlerGuard:
{
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
},
```

Điều này có nghĩa MỌI route mặc định đều cần xác thực JWT, trừ khi có `@Public()` decorator. Đây là best practice bảo mật — whitelist thay vì blacklist.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add JWT strategy, guard, and custom decorators"
```

---

### Task 1.7: Auth Module (Register, Login)

**Files:**
- Create: `back-end/src/modules/auth/entities/refresh-token.entity.ts`
- Create: `back-end/src/modules/auth/dto/register.dto.ts`
- Create: `back-end/src/modules/auth/dto/login.dto.ts`
- Create: `back-end/src/modules/auth/dto/refresh-token.dto.ts`
- Create: `back-end/src/modules/auth/auth.service.ts`
- Create: `back-end/src/modules/auth/auth.controller.ts`
- Create: `back-end/src/modules/auth/auth.module.ts`

- [ ] **Step 1: Tạo RefreshToken entity**

`back-end/src/modules/auth/entities/refresh-token.entity.ts`:
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

- [ ] **Step 2: Tạo RegisterDto**

`back-end/src/modules/auth/dto/register.dto.ts`:
```typescript
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @MaxLength(50, { message: 'Mật khẩu không được vượt quá 50 ký tự' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  fullName: string;
}
```

**Giải thích**: `class-validator` decorators tự động được ValidationPipe đọc để kiểm tra dữ liệu. Nếu không hợp lệ, tự động trả về 400 Bad Request với danh sách lỗi chi tiết. Không cần viết code validation thủ công.

- [ ] **Step 3: Tạo LoginDto**

`back-end/src/modules/auth/dto/login.dto.ts`:
```typescript
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  password: string;
}
```

- [ ] **Step 4: Tạo RefreshTokenDto**

`back-end/src/modules/auth/dto/refresh-token.dto.ts`:
```typescript
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refreshToken: string;
}
```

- [ ] **Step 5: Tạo AuthService**

`back-end/src/modules/auth/auth.service.ts`:
```typescript
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

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

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

  async refreshToken(refreshTokenStr: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshTokenStr },
      relations: ['user'],
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (new Date() > storedToken.expiresAt) {
      await this.refreshTokenRepository.remove(storedToken);
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    // Xóa token cũ, tạo token mới (rotation)
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
      expiresIn: this.configService.get<string>('jwt.accessExpires'),
    });

    const refreshTokenStr = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpires'),
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
```

**Giải thích luồng đăng nhập**:
1. User gửi email + password
2. AuthService tìm user theo email, so sánh password với bcrypt.compare()
3. Nếu đúng, tạo accessToken (15 phút) và refreshToken (7 ngày)
4. RefreshToken được lưu vào DB để có thể revoke
5. Frontend dùng accessToken cho request API, dùng refreshToken khi accessToken hết hạn

**Giải thích refresh token rotation**: Khi refresh, token cũ bị xóa và token mới được tạo. Nếu hacker đánh cắp refresh token cũ và dùng trước user thật, thì token mà user thật có sẽ bị vô hiệu hóa — user buộc phải đăng nhập lại, và hacker cũng bị chặn vì token cũ đã bị xóa.

- [ ] **Step 6: Tạo AuthController**

`back-end/src/modules/auth/auth.controller.ts`:
```typescript
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    await this.authService.logout(user.id);
    return { message: 'Đăng xuất thành công' };
  }
}
```

**Giải thích**: `@Public()` decorator đánh dấu các route không cần JWT (register, login, refresh-token). `@HttpCode(HttpStatus.OK)` để POST login trả về 200 thay vì 201. `@UseGuards(JwtAuthGuard)` cho logout là cần thiết vì logout cần xác thực.

- [ ] **Step 7: Tạo AuthModule**

`back-end/src/modules/auth/auth.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpires'),
        },
      }),
    }),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 8: Import AuthModule vào AppModule**

Sửa `back-end/src/app.module.ts`, thêm:
```typescript
import { AuthModule } from './modules/auth/auth.module';

// trong imports:
AuthModule,
```

- [ ] **Step 9: Kiểm tra**

```bash
cd back-end
npm run start:dev
```

Test với curl:
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"123456\",\"fullName\":\"Test User\"}"

# Login
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"123456\"}"

# Get profile (dùng token từ login)
curl http://localhost:3000/api/users/me -H "Authorization: Bearer <accessToken>"
```

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: add auth module (register, login, refresh token, logout)"
```

---

### Task 1.8: HTTP Exception Filter toàn cục

**Files:**
- Create: `back-end/src/common/filters/http-exception.filter.ts`
- Modify: `back-end/src/app.module.ts`

- [ ] **Step 1: Tạo HttpExceptionFilter**

`back-end/src/common/filters/http-exception.filter.ts`:
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi máy chủ nội bộ';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        message = resp.message || message;
        if (Array.isArray(resp.message)) {
          errors = resp.message;
          message = 'Dữ liệu không hợp lệ';
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

**Giải thích**: Exception Filter bắt TẤT CẢ exception trong ứng dụng. Với HttpException (bao gồm BadRequestException, NotFoundException...), nó format response chuẩn. Với lỗi không mong đợi (Error), nó log ra và trả 500. `@Catch()` không tham số nghĩa là bắt mọi loại exception. `host.switchToHttp()` chuyển context sang HTTP để lấy request/response.

- [ ] **Step 2: Đăng ký làm global filter trong AppModule**

Sửa `back-end/src/app.module.ts`, thêm:
```typescript
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

// trong providers:
{
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
},
```

- [ ] **Step 3: Kiểm tra**

Gọi API không tồn tại: `curl http://localhost:3000/api/not-found` → nhận response JSON format chuẩn.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add global HTTP exception filter"
```

---

### Task 1.9: Seed Admin User

**Files:**
- Create: `back-end/src/seeds/admin.seed.ts`
- Modify: `back-end/src/main.ts`

- [ ] **Step 1: Tạo seed script**

`back-end/src/seeds/admin.seed.ts`:
```typescript
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
```

- [ ] **Step 2: Thêm script vào package.json**

Sửa `back-end/package.json`, thêm vào scripts:
```json
"seed:admin": "ts-node -r tsconfig-paths/register src/seeds/admin.seed.ts"
```

Cài thêm: `npm install ts-node tsconfig-paths`

- [ ] **Step 3: Chạy seed**

```bash
npm run seed:admin
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add admin user seed script"
```

---

### Task 1.10: Thiết lập global prefix `/api`

**Files:**
- Modify: `back-end/src/main.ts`

- [ ] **Step 1: Cập nhật main.ts**

`back-end/src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
```

**Giải thích**:
- `setGlobalPrefix('api')`: tất cả route đều có prefix `/api` (ví dụ: `/api/auth/login`)
- `enableCors`: cho phép front-end (localhost:5173) gọi API
- `ValidationPipe` với `whitelist: true`: tự động xóa các field không khai báo trong DTO
- `forbidNonWhitelisted: true`: throw lỗi nếu field không khai báo tồn tại
- `transform: true`: tự động transform kiểu dữ liệu (string → number)

- [ ] **Step 2: Kiểm tra**

Test login: `curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@ecommerce.com\",\"password\":\"admin123\"}"`

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: configure global prefix, CORS, and validation pipe"
```

---

### Task 1.11: Khởi tạo React Frontend + Cấu hình

**Files:**
- Create: `front-end/` project qua Vite

- [ ] **Step 1: Tạo React project**

```bash
cd F:\Projects\E-Commerce
npm create vite@latest front-end -- --template react-ts
cd front-end
npm install
```

- [ ] **Step 2: Cài dependencies cho front-end**

```bash
cd front-end
npm install react-router-dom zustand axios react-hot-toast
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Cấu hình Vite proxy + Tailwind**

`front-end/vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**Giải thích Vite proxy**: Khi front-end gọi `/api/auth/login`, Vite dev server tự động chuyển tiếp request đến `http://localhost:3000/api/auth/login`. Điều này tránh vấn đề CORS trong development và giúp axios config đơn giản hơn (chỉ cần dùng relative URL).

- [ ] **Step 4: Tạo .env cho front-end**

`front-end/.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

- [ ] **Step 5: Cấu hình Tailwind CSS**

`front-end/src/index.css`:
```css
@import "tailwindcss";
```

- [ ] **Step 6: Cấu hình tsconfig paths**

Sửa `front-end/tsconfig.app.json`, thêm:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Sửa `front-end/vite.config.ts`, thêm resolve alias:
```typescript
import path from 'path';

// trong defineConfig:
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: init React frontend with Vite, Tailwind, and proxy config"
```

---

### Task 1.12: Frontend Types + Axios Config

**Files:**
- Create: `front-end/src/types/api.type.ts`
- Create: `front-end/src/types/user.type.ts`
- Create: `front-end/src/api/axios.config.ts`
- Create: `front-end/src/api/auth.api.ts`

- [ ] **Step 1: Tạo types**

`front-end/src/types/api.type.ts`:
```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  statusCode?: number;
  message?: string;
  errors?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

`front-end/src/types/user.type.ts`:
```typescript
export type { User, LoginResponse } from './api.type';
```

- [ ] **Step 2: Tạo Axios config với interceptor tự động refresh token**

`front-end/src/api/axios.config.ts`:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post('/api/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
```

**Giải thích interceptor**:
1. **Request interceptor**: Tự động gắn `accessToken` từ localStorage vào header Authorization cho mọi request
2. **Response interceptor**: Khi nhận 401 (token hết hạn):
   - Nếu đang refresh, xếp hàng request để gửi lại sau khi có token mới
   - Gọi `/api/auth/refresh-token` với `refreshToken`
   - Lưu token mới, retry request gốc
   - Nếu refresh cũng fail, xóa token và redirect về login

- [ ] **Step 3: Tạo auth.api.ts**

`front-end/src/api/auth.api.ts`:
```typescript
import api from './axios.config';
import { ApiResponse, User } from '../types/api.type';

export const authApi = {
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/login', data),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh-token', { refreshToken }),

  logout: () => api.post('/auth/logout'),

  getProfile: () =>
    api.get<ApiResponse<User>>('/users/me'),
};
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add frontend types, axios config with token refresh"
```

---

### Task 1.13: Zustand Auth Store

**Files:**
- Create: `front-end/src/store/auth.store.ts`

- [ ] **Step 1: Tạo auth store**

`front-end/src/store/auth.store.ts`:
```typescript
import { create } from 'zustand';
import { User } from '../types/api.type';
import { authApi } from '../api/auth.api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.login({ email, password });
      const { accessToken, refreshToken, user } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.register({ email, password, fullName });
      const { accessToken, refreshToken, user } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore errors
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  fetchProfile: async () => {
    try {
      const { data } = await authApi.getProfile();
      set({ user: data.data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
```

**Giải thích Zustand**: Zustand là state management library đơn giản hơn Redux rất nhiều. `create()` tạo một store với state và actions. Component gọi `useAuthStore(state => state.user)` để đọc state, và `useAuthStore(state => state.login)` để gọi action. Không cần Provider, reducer, hay action types — mọi thứ nằm gọn trong 1 file.

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Zustand auth store"
```

---

### Task 1.14: Frontend UI Components cơ bản

**Files:**
- Create: `front-end/src/components/ui/Button.tsx`
- Create: `front-end/src/components/ui/Input.tsx`
- Create: `front-end/src/components/ui/Toast.tsx`

- [ ] **Step 1: Tạo Button component**

`front-end/src/components/ui/Button.tsx`:
```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Tạo Input component**

`front-end/src/components/ui/Input.tsx`:
```typescript
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
```

- [ ] **Step 3: Tạo Toast helper**

`front-end/src/components/ui/Toast.tsx`:
```typescript
import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: () => toast.dismiss(),
};
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add basic UI components (Button, Input, Toast)"
```

---

### Task 1.15: Frontend Layout + Pages

**Files:**
- Create: `front-end/src/components/layout/Header.tsx`
- Create: `front-end/src/components/layout/Footer.tsx`
- Create: `front-end/src/pages/home/HomePage.tsx`
- Create: `front-end/src/pages/auth/LoginPage.tsx`
- Create: `front-end/src/pages/auth/RegisterPage.tsx`
- Create: `front-end/src/router/ProtectedRoute.tsx`
- Create: `front-end/src/utils/constants.ts`

- [ ] **Step 1: Tạo constants**

`front-end/src/utils/constants.ts`:
```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  CHAT: '/chat',
  PAYMENT_RESULT: '/payment/result',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
  },
} as const;
```

- [ ] **Step 2: Tạo Header**

`front-end/src/components/layout/Header.tsx`:
```typescript
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/Button';
import { ROUTES } from '../../utils/constants';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-blue-600">
            E-Shop
          </Link>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link to={ROUTES.ADMIN.DASHBOARD} className="text-gray-600 hover:text-blue-600">
                    Quản trị
                  </Link>
                )}
                <Link to={ROUTES.CART} className="text-gray-600 hover:text-blue-600">
                  Giỏ hàng
                </Link>
                <Link to={ROUTES.ORDERS} className="text-gray-600 hover:text-blue-600">
                  Đơn hàng
                </Link>
                <Link to={ROUTES.PROFILE} className="text-gray-600 hover:text-blue-600">
                  {user?.fullName}
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="outline" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Tạo Footer**

`front-end/src/components/layout/Footer.tsx`:
```typescript
export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} E-Shop. Dự án học tập NestJS + React.
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Tạo HomePage (tạm thời đơn giản)**

`front-end/src/pages/home/HomePage.tsx`:
```typescript
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../utils/constants';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Chào mừng đến với E-Shop
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Nền tảng thương mại điện tử — Dự án học tập NestJS
      </p>
      <Link to={ROUTES.PRODUCTS}>
        <Button size="lg">Xem sản phẩm</Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: Tạo LoginPage**

`front-end/src/pages/auth/LoginPage.tsx`:
```typescript
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';
import { ROUTES } from '../../utils/constants';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      showToast.success('Đăng nhập thành công');
      navigate(ROUTES.HOME);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại';
      showToast.error(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@ecommerce.com"
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Đăng nhập
          </Button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Tạo RegisterPage**

`front-end/src/pages/auth/RegisterPage.tsx`:
```typescript
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';
import { ROUTES } from '../../utils/constants';

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, fullName);
      showToast.success('Đăng ký thành công');
      navigate(ROUTES.HOME);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng ký thất bại';
      showToast.error(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
          <Input
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ít nhất 6 ký tự"
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Đăng ký
          </Button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Đã có tài khoản?{' '}
          <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Tạo ProtectedRoute**

`front-end/src/router/ProtectedRoute.tsx`:
```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '../utils/constants';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add Header, Footer, pages, and protected route"
```

---

### Task 1.16: Tích hợp Router + App + main.tsx

**Files:**
- Create: `front-end/src/router/AppRouter.tsx`
- Modify: `front-end/src/App.tsx`
- Modify: `front-end/src/main.tsx`

- [ ] **Step 1: Tạo AppRouter**

`front-end/src/router/AppRouter.tsx`:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes - sẽ thêm ở các giai đoạn sau */}
            <Route element={<ProtectedRoute />}>
              {/* Placeholder cho cart, orders, profile */}
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Cập nhật App.tsx**

`front-end/src/App.tsx`:
```typescript
import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAuthStore } from './store/auth.store';

export default function App() {
  const { isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, []);

  return <AppRouter />;
}
```

- [ ] **Step 3: Cập nhật main.tsx**

`front-end/src/main.tsx`:
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 4: Kiểm tra toàn bộ flow**

```bash
# Terminal 1: Backend
cd back-end
npm run start:dev

# Terminal 2: Frontend
cd front-end
npm run dev
```

Mở http://localhost:5173, kiểm tra:
- Trang chủ hiển thị
- Đăng ký user mới
- Đăng nhập với admin@ecommerce.com / admin123
- Sau khi đăng nhập, Header hiển thị tên user và menu

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: integrate router, app, and main entry"
```

---

### TỔNG KẾT GIAI ĐOẠN 1

Sau khi hoàn thành Giai đoạn 1, bạn đã có:
- Back-end NestJS với Auth module (register, login, JWT, refresh token)
- Database PostgreSQL với User và Address entities
- Global exception filter, validation pipe, rate limiting
- Front-end React với TailwindCSS, Router, Zustand
- Axios interceptor tự động refresh token
- Auth flow hoàn chỉnh từ UI đến API

**Các khái niệm NestJS đã học**: Module, Controller, Provider/Service, Dependency Injection, Entity, Repository Pattern, Pipe, Guard, Strategy (Passport), Decorator, Exception Filter, ConfigModule, TypeOrmModule

Chạy `git log --oneline` để xem lịch sử commit — mỗi commit tương ứng với một bước học.

*(Các giai đoạn tiếp theo sẽ được viết trong các file plan riêng để tránh file quá dài)*
