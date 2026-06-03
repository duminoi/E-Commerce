# NestJS Concepts — Giải thích qua dự án E-Commerce

> **Dự án**: NestJS ^11.0.1, PostgreSQL + TypeORM, JWT Auth, Socket.IO, Redis, Swagger  
> **Kiến trúc**: Monorepo — `back-end/` (NestJS API), `front-end/`, `docs/`

---

## Mục lục

1. [Module](#1-module)
2. [Controller](#2-controller)
3. [Service (`@Injectable`) & Dependency Injection](#3-service--dependency-injection)
4. [Dependency Injection (DI)](#4-dependency-injection-di-chi-tiết)
5. [Guard](#5-guard)
6. [Middleware](#6-middleware)
7. [Interceptor](#7-interceptor)
8. [Pipe](#8-pipe)
9. [Exception Filter](#9-exception-filter)
10. [Custom Decorator](#10-custom-decorator)
11. [WebSocket Gateway](#11-websocket-gateway)
12. [Luồng xử lý request hoàn chỉnh](#12-luồng-xử-lý-request-hoàn-chỉnh)

---

## 1. Module

Module là đơn vị tổ chức code trong NestJS, nhóm các thành phần liên quan (controller, service, entity, ...).

### AppModule — Root Module

```typescript
// back-end/src/app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, jwtConfig, redisConfig, appConfig] }),
    TypeOrmModule.forRootAsync({ ... }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    UserModule,
    AuthModule,
    ProductModule,
    // ... 13 feature modules
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
```

### Feature Module điển hình — UserModule

```typescript
// back-end/src/modules/user/user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],   // Đăng ký entity với TypeORM
  controllers: [UserController, AdminUserController],     // 2 controller: user + admin
  providers: [UserService],                                // Service (injectable)
  exports: [UserService],                                  // Cho module khác dùng
})
export class UserModule {}
```

**Giải thích các thuộc tính `@Module`:**

| Thuộc tính | Vai trò |
|---|---|
| `imports` | Import các module khác (feature module, global module, dynamic module) |
| `controllers` | Đăng ký controller cho module này |
| `providers` | Đăng ký service/guard/strategy vào NestJS container |
| `exports` | Chia sẻ provider ra ngoài để module khác inject được |

### AuthModule — Module có dynamic module (JwtModule.registerAsync)

```typescript
// back-end/src/modules/auth/auth.module.ts
@Module({
  imports: [
    UserModule,                                    // Import để dùng UserService
    PassportModule,
    JwtModule.registerAsync({                       // Dynamic module — cấu hình async
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: configService.get<string>('jwt.accessExpires') as any },
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

### RedisModule — Global Module

```typescript
// back-end/src/modules/redis/redis.module.ts
@Global()                          // Đánh dấu global — không cần import lại ở module khác
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',     // Custom provider (token string)
      useFactory: (configService: ConfigService) => {
        const Redis = require('ioredis');
        return new Redis({ host: configService.get('redis.host'), ... });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
```

**Tổng số module trong dự án: 14** (AppModule + 13 feature modules)

```
AppModule
 ├── ConfigModule (global)         # @nestjs/config
 ├── TypeOrmModule (async)        # PostgreSQL
 ├── ThrottlerModule              # Rate limiting
 ├── RedisModule (@Global)        # Redis cache
 ├── AuthModule ──> UserModule
 ├── UserModule
 ├── ProductModule
 ├── CategoryModule
 ├── CartModule
 ├── OrderModule ──> CartModule, UserModule
 ├── PaymentModule ──> OrderModule
 ├── ReviewModule ──> OrderModule
 ├── ChatModule
 ├── DashboardModule
 ├── UploadModule
 └── MailModule
```

---

## 2. Controller

Controller xử lý HTTP request và response. **Không chứa logic nghiệp vụ** — chỉ nhận request, gọi service, trả response.

### AuthController — Controller cơ bản

```typescript
// back-end/src/modules/auth/auth.controller.ts
@Controller('auth')                          // Route prefix: /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}  // DI

  @Public()                                  // Custom decorator: bypass JWT guard
  @Post('register')                          // POST /api/auth/register
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);    // Gọi service, trả về kết quả
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)                   // Set status code
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)                   // Route-level guard
  async logout(@CurrentUser() user: any) {   // Custom param decorator
    await this.authService.logout(user.id);
    return { message: 'Đăng xuất thành công' };
  }
}
```

### UserController — Controller với JwtAuthGuard

```typescript
// back-end/src/modules/user/user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.userService.update(user.id, dto);
  }
}
```

### AdminUserController — Controller với guard ở class-level

```typescript
// back-end/src/modules/user/admin-user.controller.ts
@Controller('admin/users')                   // Route prefix: /api/admin/users
@UseGuards(JwtAuthGuard, RolesGuard)          // Guard class-level — áp dụng cho ALL routes
@Roles(Role.ADMIN)                            // Metadata cho RolesGuard
export class AdminUserController {
  constructor(private readonly service: UserService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.service.updateRole(id, role);
  }
}
```

### DashboardController — Admin-only

```typescript
// back-end/src/modules/dashboard/dashboard.controller.ts
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}
  @Get('stats')
  getStats() { return this.service.getStats(); }
}
```

**Các decorator thường dùng trong Controller:**

| Decorator | Mục đích |
|---|---|
| `@Body()` | Lấy request body |
| `@Param('id')` | Lấy route parameter |
| `@Query('page')` | Lấy query string parameter |
| `@Headers('auth')` | Lấy header |
| `@Req()` / `@Request()` | Lấy toàn bộ request object (Express) |
| `@HttpCode(code)` | Set HTTP status code |
| `@Redirect(url)` | Redirect |
| `@UseGuards(Guard)` | Áp dụng guard |

---

## 3. Service & Dependency Injection

Service chứa **logic nghiệp vụ** (business logic). Được đánh dấu `@Injectable()` để NestJS có thể inject vào controller hoặc service khác.

### AuthService — Service điển hình

```typescript
// back-end/src/modules/auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,                    // Inject service khác
    private readonly jwtService: JwtService,                       // Built-in NestJS provider
    private readonly configService: ConfigService,                 // Config module
    @InjectRepository(RefreshToken)                                // TypeORM repository injection
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
    });
    const tokens = await this.generateTokens(user);
    return { ...tokens, user };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessExpires') as any,
    });
    // ... refresh token logic
    return { accessToken, refreshToken: refreshTokenStr };
  }
}
```

### UserService — Service với Repository Injection

```typescript
// back-end/src/modules/user/user.service.ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { addresses: true },
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const existing = await this.findByEmail(data.email!);
    if (existing) throw new ConflictException('Email đã tồn tại');
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
```

### OrderService — Transaction nghiệp vụ phức tạp

```typescript
// back-end/src/modules/order/order.service.ts
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant) private readonly variantRepo: Repository<ProductVariant>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,        // TypeORM DataSource
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const { cart, total } = await this.cartService.getCart(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();          // Bắt đầu transaction

    try {
      // Tạo order
      const order = queryRunner.manager.create(Order, { userId, totalPrice: total, ... });
      const savedOrder = await queryRunner.manager.save(order);

      // Từng item trong giỏ hàng → order item + trừ stock
      for (const cartItem of cart.items) {
        // Kiểm tra tồn kho
        if (variant.quantity < cartItem.quantity) {
          throw new BadRequestException('Không đủ hàng');
        }
        await queryRunner.manager.update(ProductVariant, variant.id, {
          quantity: variant.quantity - cartItem.quantity,
        });
        await queryRunner.manager.save(OrderItem, { orderId: savedOrder.id, ... });
      }

      await queryRunner.manager.delete('cart_items', { cartId: cart.id });
      await queryRunner.commitTransaction();        // Commit
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();      // Rollback nếu lỗi
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
```

---

## 4. Dependency Injection (DI) — Chi tiết

NestJS sử dụng **constructor-based DI**. Khi một class được đánh dấu `@Injectable()`, NestJS container sẽ tự động resolve tất cả dependencies trong constructor.

### Các hình thức DI trong dự án

| Hình thức | Ví dụ code |
|---|---|
| **Service → Service** | `AuthService` inject `UserService` |
| **Service → Repository** | `UserService` inject `@InjectRepository(User) Repository<User>` |
| **Service → Built-in Provider** | `AuthService` inject `JwtService`, `ConfigService` |
| **Service → Custom Provider** | `RedisService` inject `@Inject('REDIS_CLIENT')` |
| **Controller → Service** | `AuthController` inject `AuthService` |
| **Guard → Reflector** | `JwtAuthGuard` inject `Reflector` |
| **Strategy → Service** | `JwtStrategy` inject `UserService` |
| **Gateway → Service** | `ChatGateway` inject `ChatService` |

### Ví dụ: Custom Provider với `useFactory` + `@Inject`

```typescript
// back-end/src/modules/redis/redis.module.ts
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',                      // Injection token (string)
      useFactory: (configService: ConfigService) => {
        return new Redis({ host: configService.get('redis.host'), ... });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}

// back-end/src/modules/redis/redis.service.ts
@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: any,  // Inject bằng token string
  ) {}
}
```

### Ví dụ: Async Provider với `registerAsync`

```typescript
// back-end/src/modules/auth/auth.module.ts
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('jwt.accessSecret'),
    signOptions: { expiresIn: configService.get<string>('jwt.accessExpires') as any },
  }),
}),
```

### Ví dụ: Standalone App — lấy service từ container

```typescript
// back-end/src/seeds/admin.seed.ts
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);     // Directly resolve từ container
  await userService.create({ email: 'admin@ecommerce.com', ... });
  await app.close();
}
```

---

## 5. Guard

Guard kiểm tra điều kiện trước khi request đến controller. Implement `CanActivate` interface, trả về `boolean` (cho phép/từ chối).

### JwtAuthGuard — Global Guard + @Public bypass

```typescript
// back-end/src/common/guards/jwt-auth.guard.ts
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
      return true;          // Bỏ qua JWT check cho các route có @Public()
    }
    return super.canActivate(context);
  }
}
```

**Đăng ký global** trong AppModule:
```typescript
{ provide: APP_GUARD, useClass: JwtAuthGuard }
```

### RolesGuard — Role-Based Access Control

```typescript
// back-end/src/common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;                // Không yêu cầu role → cho phép
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user?.role);      // Kiểm tra user.role
  }
}
```

**Sử dụng**: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)`

### JwtStrategy — Passport Strategy

```typescript
// back-end/src/modules/auth/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret')!,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.userService.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Tài khoản không hợp lệ hoặc đã bị khóa');
    }
    return { id: user.id, email: user.email, role: user.role };  // Gắn vào request.user
  }
}
```

---

## 6. Middleware

Middleware xử lý request/response trước khi đến guard. Trong dự án này:

- **Không có custom middleware** (không tìm thấy file `*.middleware.ts`)
- Sử dụng **helmet** (middleware từ Express ecosystem) trong `main.ts`:

```typescript
// back-end/src/main.ts
app.use(helmet());
```

- **ThrottlerGuard** (rate limiting) đăng ký global dưới dạng Guard, nhưng về mặt concept hoạt động như middleware:

```typescript
// back-end/src/app.module.ts
{ provide: APP_GUARD, useClass: ThrottlerGuard }
// Cấu hình: 100 requests / 60 giây
```

---

## 7. Interceptor

Interceptor can thiệp vào **luồng xử lý request/response** — có thể thay đổi dữ liệu trước khi trả về.

### TransformInterceptor — Global Response Wrapper

```typescript
// back-end/src/common/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // Trường hợp 1: data đã được wrap sẵn (có field 'data')
        if (data && data.data !== undefined) return data;

        // Trường hợp 2: paginated response (có items + meta)
        if (data && data.items !== undefined && data.meta !== undefined) {
          return { success: true, data: { items: data.items }, meta: data.meta };
        }

        // Trường hợp 3: mặc định — wrap thành { success: true, data }
        return { success: true, data };
      }),
    );
  }
}
```

**Đăng ký global** trong `main.ts`:
```typescript
app.useGlobalInterceptors(new TransformInterceptor());
```

**Kết quả**: Mọi response từ controller đều được tự động wrap thành format thống nhất:
```json
{
  "success": true,
  "data": { ... }
}
```

Hoặc với pagination:
```json
{
  "success": true,
  "data": { "items": [...] },
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

---

## 8. Pipe

Pipe xử lý và **biến đổi dữ liệu đầu vào** — thường dùng để validate và transform.

### ValidationPipe — Global Pipe

```typescript
// back-end/src/main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,               // Tự động loại bỏ field không trong DTO
    forbidNonWhitelisted: true,    // Báo lỗi nếu có field lạ
    transform: true,               // Tự động chuyển kiểu (vd: "1" → 1)
  }),
);
```

### DTO với class-validator

```typescript
// back-end/src/modules/auth/dto/register.dto.ts
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

Khi request body không hợp lệ, ValidationPipe tự động trả về `400 Bad Request` với mảng lỗi.

### ParseFilePipe — Pipe cho file upload

```typescript
// Sử dụng trong UploadController (đọc từ code)
new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),   // 5MB
    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
  ],
})
```

---

## 9. Exception Filter

Exception Filter bắt và xử lý lỗi, trả về response format thống nhất.

### HttpExceptionFilter — Global Exception Filter

```typescript
// back-end/src/common/filters/http-exception.filter.ts
@Catch()                           // Bắt TẤT CẢ exception (HttpException + Error)
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
          errors = resp.message;             // Validation errors array
          message = 'Dữ liệu không hợp lệ';
        }
      }
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

**Đăng ký global** trong AppModule:
```typescript
{ provide: APP_FILTER, useClass: HttpExceptionFilter }
```

**Response mẫu khi lỗi**:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Dữ liệu không hợp lệ",
  "errors": ["Email không hợp lệ", "Mật khẩu phải có ít nhất 6 ký tự"],
  "timestamp": "2026-06-03T10:00:00.000Z",
  "path": "/api/auth/register"
}
```

---

## 10. Custom Decorator

### @Public() — Bypass JWT Auth

```typescript
// back-end/src/common/decorators/public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Sử dụng**: `@Public()` trên route — JwtAuthGuard sẽ bỏ qua JWT check.

### @Roles(...) — Role Metadata

```typescript
// back-end/src/common/decorators/roles.decorator.ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

**Sử dụng**: `@Roles(Role.ADMIN)` — RolesGuard đọc metadata này để kiểm tra quyền.

### @CurrentUser() — Custom Param Decorator

```typescript
// back-end/src/common/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user?.[data];       // @CurrentUser('id') → user.id
    }
    return request.user;                  // @CurrentUser() → user object
  },
);
```

**Sử dụng**: 
- `@CurrentUser() user: any` — lấy toàn bộ user object
- `@CurrentUser('id') userId: string` — lấy userId từ `request.user.id`

---

## 11. WebSocket Gateway

Gateway xử lý WebSocket (Socket.IO) real-time communication.

### ChatGateway

```typescript
// back-end/src/modules/chat/chat.gateway.ts
@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}  // DI — inject service

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(data.roomId);
    return { event: 'joined', data: { roomId: data.roomId } };
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string; userId: string },
  ) {
    const message = await this.chatService.saveMessage(data.roomId, data.userId, data.message);
    this.server.to(data.roomId).emit('new-message', message);   // Broadcast
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; isTyping: boolean },
  ) {
    client.to(data.roomId).emit('typing', { userId: data.userId, isTyping: data.isTyping });
  }
}
```

**Đăng ký trong module** như một provider (không controller):
```typescript
// back-end/src/modules/chat/chat.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, ChatMessage])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
```

---

## 12. Luồng xử lý request hoàn chỉnh

```
HTTP Request
  │
  ├── (1) Middleware: helmet() — bảo mật header
  │
  ├── (2) ThrottlerGuard (global) — rate limit: 100 req/60s
  │
  ├── (3) JwtAuthGuard (global) — kiểm tra JWT token
  │      └── Nếu có @Public() → bypass
  │      └── Nếu không → validate token qua JwtStrategy
  │            └── Gắn user object vào request.user
  │
  ├── (4) RolesGuard — kiểm tra role (nếu có @Roles())
  │      └── So sánh request.user.role với required roles
  │
  ├── (5) ValidationPipe (global) — validate DTO
  │      └── whitelist: loại bỏ field lạ
  │      └── transform: tự động chuyển kiểu
  │
  ├── (6) Controller — nhận dữ liệu đã sạch
  │      └── Gọi service.method()
  │
  ├── (7) Service — xử lý logic nghiệp vụ
  │      └── Gọi Repository (TypeORM) hoặc service khác
  │      └── Nếu cần: DataSource.queryRunner (transaction)
  │
  ├── (8) TransformInterceptor (global, after)
  │      └── Wrap response thành { success: true, data }
  │      └── Hoặc { success: true, data: { items }, meta } cho pagination
  │
  └── (9) HTTP Response
        └── Nếu có lỗi → HttpExceptionFilter catch → format lỗi
```

---

## Tổng kết

| Concept | File trong dự án | Số lượng |
|---|---|---|
| **Module** | `*.module.ts` | 14 |
| **Controller** | `*.controller.ts` | 14 |
| **Service** | `*.service.ts` | 16 |
| **Guard** | `*.guard.ts` | 2 |
| **Interceptor** | `*.interceptor.ts` | 1 |
| **Pipe** | ValidationPipe (global), ParseFilePipe | 2 (built-in) |
| **Exception Filter** | `*.filter.ts` | 1 |
| **Middleware** | helmet(), ThrottlerGuard | 2 |
| **Decorator** | `*.decorator.ts` | 3 |
| **Strategy** (Passport) | `*.strategy.ts` | 1 |
| **Gateway** (WebSocket) | `*.gateway.ts` | 1 |
| **Entity** (TypeORM) | `*.entity.ts` | 15 |
| **DTO** | `*.dto.ts` | 13 |
| **Config** | `*.config.ts` | 4 |
| **Seed** | `*.seed.ts` | 2 |
