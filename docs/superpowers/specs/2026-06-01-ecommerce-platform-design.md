# E-Commerce Platform — Design Spec

**Date**: 2026-06-01  
**Status**: Draft  
**Author**: opencode

---

## 1. Tổng quan

### 1.1 Mục tiêu
Xây dựng một nền tảng E-Commerce Single Vendor hoàn chỉnh nhằm mục đích học tập Node.js framework NestJS, bao gồm toàn bộ các tính năng từ cơ bản đến nâng cao: xác thực, quản lý sản phẩm, giỏ hàng, đặt hàng, thanh toán, admin dashboard, đánh giá, realtime chat, upload file, caching, logging.

### 1.2 Mô hình kinh doanh
**Single Vendor** — một cửa hàng duy nhất. Admin thêm sản phẩm và quản lý đơn hàng. Khách hàng duyệt sản phẩm, thêm vào giỏ, đặt hàng, thanh toán.

### 1.3 Phạm vi
Full-stack: NestJS backend API + React frontend SPA.

---

## 2. Tech Stack

### Back-end
| Công nghệ | Vai trò |
|-----------|--------|
| NestJS 11 | Framework chính |
| TypeScript 5 | Ngôn ngữ |
| PostgreSQL 16 | Database chính |
| TypeORM | ORM |
| Redis 7 | Cache + Session (ioredis) |
| JWT (jsonwebtoken) | Access token + Refresh token |
| bcrypt | Hash password |
| class-validator + class-transformer | Validate + Transform DTO |
| multer | Upload file (local disk) |
| VNPay (axios) | Thanh toán |
| @nestjs/websockets + Socket.IO | Realtime chat |
| nodemailer | Gửi email |
| winston | Logging |
| @nestjs/throttler | Rate limiting |
| @nestjs/swagger | API documentation |
| helmet | Security headers |

### Front-end
| Công nghệ | Vai trò |
|-----------|--------|
| React 19 | UI library |
| TypeScript 5 | Ngôn ngữ |
| Vite | Build tool + Dev server + Proxy |
| TailwindCSS 4 | Styling |
| Zustand | State management |
| React Router v7 | Routing |
| Axios | HTTP client |
| Socket.IO client | Realtime chat |
| Recharts | Admin dashboard charts |
| react-hot-toast | Toast notifications |

### Infrastructure
| Công nghệ | Vai trò |
|-----------|--------|
| Docker + docker-compose | PostgreSQL + Redis containers |
| Dockerfile (back-end + front-end) | Production build |
| Nginx | Serve front-end + proxy API (production) |

---

## 3. Cấu trúc dự án

```
E-Commerce/
├── back-end/
│   ├── src/
│   │   ├── config/                     # Cấu hình tập trung
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   ├── upload.config.ts
│   │   │   ├── redis.config.ts
│   │   │   ├── vnpay.config.ts
│   │   │   ├── mail.config.ts
│   │   │   └── app.config.ts
│   │   ├── common/                     # Shared utilities
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   ├── roles.decorator.ts
│   │   │   │   └── public.decorator.ts
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   ├── roles.guard.ts
│   │   │   │   └── ws-jwt.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── transform.interceptor.ts
│   │   │   │   └── logging.interceptor.ts
│   │   │   └── enums/
│   │   │       ├── role.enum.ts
│   │   │       ├── order-status.enum.ts
│   │   │       ├── payment-method.enum.ts
│   │   │       └── payment-status.enum.ts
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── auth.module.ts
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.service.ts
│   │       │   ├── strategies/
│   │       │   │   └── jwt.strategy.ts
│   │       │   ├── dto/
│   │       │   │   ├── register.dto.ts
│   │       │   │   ├── login.dto.ts
│   │       │   │   ├── refresh-token.dto.ts
│   │       │   │   └── forgot-password.dto.ts
│   │       │   └── entities/
│   │       │       ├── refresh-token.entity.ts
│   │       │       └── password-reset.entity.ts
│   │       ├── user/
│   │       │   ├── user.module.ts
│   │       │   ├── user.controller.ts
│   │       │   ├── user.service.ts
│   │       │   ├── dto/
│   │       │   │   ├── update-user.dto.ts
│   │       │   │   ├── create-address.dto.ts
│   │       │   │   └── update-address.dto.ts
│   │       │   └── entities/
│   │       │       ├── user.entity.ts
│   │       │       └── address.entity.ts
│   │       ├── product/
│   │       │   ├── product.module.ts
│   │       │   ├── product.controller.ts
│   │       │   ├── product.service.ts
│   │       │   ├── dto/
│   │       │   │   ├── create-product.dto.ts
│   │       │   │   ├── update-product.dto.ts
│   │       │   │   └── query-product.dto.ts
│   │       │   └── entities/
│   │       │       ├── product.entity.ts
│   │       │       ├── product-image.entity.ts
│   │       │       └── product-variant.entity.ts
│   │       ├── category/
│   │       │   ├── category.module.ts
│   │       │   ├── category.controller.ts
│   │       │   ├── category.service.ts
│   │       │   ├── dto/
│   │       │   │   ├── create-category.dto.ts
│   │       │   │   └── update-category.dto.ts
│   │       │   └── entities/
│   │       │       └── category.entity.ts
│   │       ├── cart/
│   │       │   ├── cart.module.ts
│   │       │   ├── cart.controller.ts
│   │       │   ├── cart.service.ts
│   │       │   ├── dto/
│   │       │   │   └── cart-item.dto.ts
│   │       │   └── entities/
│   │       │       ├── cart.entity.ts
│   │       │       └── cart-item.entity.ts
│   │       ├── order/
│   │       │   ├── order.module.ts
│   │       │   ├── order.controller.ts
│   │       │   ├── order.service.ts
│   │       │   ├── dto/
│   │       │   │   ├── create-order.dto.ts
│   │       │   │   └── update-order-status.dto.ts
│   │       │   └── entities/
│   │       │       ├── order.entity.ts
│   │       │       └── order-item.entity.ts
│   │       ├── payment/
│   │       │   ├── payment.module.ts
│   │       │   ├── payment.controller.ts
│   │       │   ├── payment.service.ts
│   │       │   ├── vnpay.service.ts
│   │       │   ├── dto/
│   │       │   │   └── create-payment.dto.ts
│   │       │   └── entities/
│   │       │       └── payment.entity.ts
│   │       ├── review/
│   │       │   ├── review.module.ts
│   │       │   ├── review.controller.ts
│   │       │   ├── review.service.ts
│   │       │   ├── dto/
│   │       │   │   ├── create-review.dto.ts
│   │       │   │   └── update-review.dto.ts
│   │       │   └── entities/
│   │       │       └── review.entity.ts
│   │       ├── chat/
│   │       │   ├── chat.module.ts
│   │       │   ├── chat.gateway.ts
│   │       │   ├── chat.service.ts
│   │       │   └── entities/
│   │       │       ├── chat-room.entity.ts
│   │       │       └── chat-message.entity.ts
│   │       ├── upload/
│   │       │   ├── upload.module.ts
│   │       │   ├── upload.controller.ts
│   │       │   └── upload.service.ts
│   │       ├── dashboard/
│   │       │   ├── dashboard.module.ts
│   │       │   ├── dashboard.controller.ts
│   │       │   └── dashboard.service.ts
│   │       ├── redis/
│   │       │   ├── redis.module.ts
│   │       │   └── redis.service.ts
│   │       └── mail/
│   │           ├── mail.module.ts
│   │           └── mail.service.ts
│   ├── uploads/                        # Thư mục lưu file upload
│   ├── .env
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── front-end/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.config.ts
│   │   │   ├── auth.api.ts
│   │   │   ├── product.api.ts
│   │   │   ├── cart.api.ts
│   │   │   ├── order.api.ts
│   │   │   ├── payment.api.ts
│   │   │   ├── review.api.ts
│   │   │   ├── upload.api.ts
│   │   │   └── chat.api.ts
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   ├── cart.store.ts
│   │   │   └── ui.store.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useSocket.ts
│   │   │   └── usePagination.ts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   └── AuthLayout.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Pagination.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Badge.tsx
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductFilter.tsx
│   │   │   │   └── ProductSearch.tsx
│   │   │   └── cart/
│   │   │       ├── CartItem.tsx
│   │   │       └── CartSummary.tsx
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── HomePage.tsx
│   │   │   ├── products/
│   │   │   │   ├── ProductListPage.tsx
│   │   │   │   └── ProductDetailPage.tsx
│   │   │   ├── cart/
│   │   │   │   └── CartPage.tsx
│   │   │   ├── checkout/
│   │   │   │   └── CheckoutPage.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── user/
│   │   │   │   ├── ProfilePage.tsx
│   │   │   │   ├── OrdersPage.tsx
│   │   │   │   ├── OrderDetailPage.tsx
│   │   │   │   └── ReviewsPage.tsx
│   │   │   ├── chat/
│   │   │   │   └── ChatPage.tsx
│   │   │   └── admin/
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── ProductManagePage.tsx
│   │   │       ├── OrderManagePage.tsx
│   │   │       └── UserManagePage.tsx
│   │   ├── router/
│   │   │   ├── AppRouter.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── AdminRoute.tsx
│   │   ├── types/
│   │   │   ├── product.type.ts
│   │   │   ├── user.type.ts
│   │   │   ├── order.type.ts
│   │   │   └── api.type.ts
│   │   ├── utils/
│   │   │   ├── formatCurrency.ts
│   │   │   ├── formatDate.ts
│   │   │   └── constants.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── docker-compose.yml
```

---

## 4. Database Schema

### 4.1 Entities

**User** — Người dùng hệ thống
- id (PK, UUID)
- email (unique)
- password (hashed)
- fullName
- avatar (nullable)
- role (enum: USER, ADMIN, default: USER)
- isActive (boolean, default: true)
- createdAt, updatedAt

**RefreshToken** — Quản lý refresh token
- id (PK, UUID)
- userId (FK → User)
- token (unique)
- expiresAt
- createdAt

**Address** — Địa chỉ giao hàng
- id (PK, UUID)
- userId (FK → User)
- fullName
- phone
- province
- district
- ward
- detail
- isDefault (boolean)
- createdAt, updatedAt

**Category** — Danh mục sản phẩm (self-referencing tree)
- id (PK, UUID)
- name (unique)
- slug (unique)
- description (nullable)
- image (nullable)
- parentId (FK → Category, nullable)
- createdAt, updatedAt

**Product** — Sản phẩm
- id (PK, UUID)
- name
- slug (unique)
- description (text)
- price (decimal)
- comparePrice (decimal, nullable, giá gốc để hiển thị giảm giá)
- quantity (int, tổng tồn kho)
- sold (int, default: 0)
- isActive (boolean, default: true)
- categoryId (FK → Category)
- createdAt, updatedAt
- Indexes: slug, categoryId, isActive, price, name (full-text search)

**ProductImage** — Ảnh sản phẩm
- id (PK, UUID)
- productId (FK → Product)
- url
- isThumbnail (boolean, default: false)
- sortOrder (int, default: 0)

**ProductVariant** — Biến thể sản phẩm (size, màu...)
- id (PK, UUID)
- productId (FK → Product)
- name (e.g. "Size")
- value (e.g. "XL")
- price (decimal, nullable — null = dùng giá sản phẩm)
- quantity (int)
- isActive (boolean, default: true)

**Cart** — Giỏ hàng
- id (PK, UUID)
- userId (FK → User, unique — 1 user 1 cart)

**CartItem** — Item trong giỏ hàng
- id (PK, UUID)
- cartId (FK → Cart)
- productId (FK → Product)
- variantId (FK → ProductVariant, nullable)
- quantity (int)
- Unique: [cartId, productId, variantId]

**Order** — Đơn hàng
- id (PK, UUID)
- userId (FK → User)
- status (enum: PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED)
- totalPrice (decimal)
- shippingFee (decimal, default: 0)
- addressSnapshot (json — lưu địa chỉ tại thời điểm đặt hàng)
- note (nullable)
- paidAt (nullable)
- shippedAt (nullable)
- deliveredAt (nullable)
- cancelledAt (nullable)
- cancelReason (nullable)
- createdAt, updatedAt

**OrderItem** — Item trong đơn hàng (snapshot)
- id (PK, UUID)
- orderId (FK → Order)
- productId (FK → Product, nullable — giữ reference nếu sản phẩm chưa bị xóa)
- variantId (FK → ProductVariant, nullable)
- productName (snapshot)
- productImage (snapshot)
- price (snapshot)
- quantity (int)

**Payment** — Thanh toán
- id (PK, UUID)
- orderId (FK → Order, unique)
- amount (decimal)
- method (enum: VNPAY, COD)
- status (enum: PENDING, SUCCESS, FAILED, REFUNDED)
- vnpayTxnRef (nullable)
- vnpayResponseCode (nullable)
- paidAt (nullable)
- createdAt, updatedAt

**Review** — Đánh giá sản phẩm
- id (PK, UUID)
- userId (FK → User)
- productId (FK → Product)
- orderId (FK → Order, nullable)
- rating (int, 1-5)
- comment (text, nullable)
- createdAt, updatedAt
- Unique: [userId, productId, orderId] — mỗi order chỉ review 1 lần/sản phẩm

**ChatRoom** — Phòng chat
- id (PK, UUID)
- userId (FK → User)
- adminId (FK → User, nullable)
- orderId (FK → Order, nullable)
- isActive (boolean, default: true)
- lastMessage (text, nullable)
- updatedAt, createdAt

**ChatMessage** — Tin nhắn
- id (PK, UUID)
- roomId (FK → ChatRoom)
- senderId (FK → User)
- message (text)
- isRead (boolean, default: false)
- createdAt

### 4.2 Entity Relationship Summary

```
User 1──n Address
User 1──n RefreshToken
User 1──1 Cart
User 1──n Order
User 1──n Review
User 1──n ChatRoom (as user)
User 1──n ChatMessage

Category 1──n Category (self-reference, parent-child)
Category 1──n Product

Product 1──n ProductImage
Product 1──n ProductVariant
Product 1──n Review
Product 1──n CartItem
Product 1──n OrderItem

Cart 1──n CartItem

Order 1──n OrderItem
Order 1──1 Payment
Order 1──n Review
Order 1──1 ChatRoom (optional)

ChatRoom 1──n ChatMessage
```

---

## 5. NestJS Architecture

### 5.1 Request Lifecycle

```
Request
  → Middleware (Global: CORS, Helmet, Cookie Parser, Logger)
  → Guards (AuthGuard: xác thực JWT | RolesGuard: kiểm tra quyền)
  → Interceptors PRE (LoggingInterceptor: log request)
  → Pipes (ValidationPipe: validate DTO với class-validator | ParseIntPipe: transform)
  → Controller (điều hướng request → gọi Service)
  → Service (business logic → gọi Repository)
  → Repository (TypeORM → PostgreSQL)
  → Interceptors POST (TransformInterceptor: bọc response { success, data, meta })
  → Exception Filters (HttpExceptionFilter: format lỗi chuẩn)
→ Response
```

### 5.2 Key Concepts

**Module** — Đơn vị tổ chức code, gom nhóm Controller + Provider liên quan. Mỗi module là một `@Module()` decorator với 4 thuộc tính: `imports`, `controllers`, `providers`, `exports`.

**Controller** — Định nghĩa routes (`@Get()`, `@Post()`...). Chỉ làm nhiệm vụ nhận request → gọi service → trả response. KHÔNG chứa business logic.

**Provider / Service** — Chứa business logic. Được đánh dấu `@Injectable()` và inject qua constructor (DI).

**Dependency Injection (DI)** — NestJS IoC container tự động tạo instance của các provider và inject vào nơi cần dùng. Không cần `new` thủ công.

**Guard** — Quyết định request có được phép tiếp tục không. Trả về `true/false`. Dùng để xác thực và phân quyền.

**Interceptor** — Chặn request/response để transform dữ liệu. Chạy cả trước và sau khi request đến controller.

**Pipe** — Validate và transform dữ liệu đầu vào. `ValidationPipe` tự động kiểm tra DTO dựa trên decorator của `class-validator`.

**Exception Filter** — Bắt tất cả exception chưa xử lý, format về response chuẩn.

### 5.3 Authentication Flow

1. User gửi email + password → `POST /api/auth/login`
2. AuthService kiểm tra credentials, trả về `{ accessToken, refreshToken }`
3. Frontend lưu accessToken vào memory (Zustand), refreshToken vào httpOnly cookie hoặc localStorage
4. Mỗi request tiếp theo: Axios interceptor gắn `Authorization: Bearer <accessToken>`
5. JwtAuthGuard giải mã token, gắn user vào `request.user`
6. Khi accessToken hết hạn (401): Axios interceptor tự động gọi `/api/auth/refresh-token`
7. Nếu refresh token cũng hết hạn: logout, redirect về login

### 5.4 Authorization

- `@Roles('ADMIN')` decorator đánh dấu route yêu cầu quyền admin
- `@Public()` decorator đánh dấu route không cần xác thực
- `RolesGuard` kiểm tra `request.user.role` sau khi JwtAuthGuard đã gắn user

### 5.5 WebSocket Architecture (Chat)

- `ChatGateway` sử dụng `@WebSocketGateway()` với Socket.IO
- `WsJwtGuard` xác thực WebSocket connection qua token trong handshake query
- Mỗi order tạo một ChatRoom. Customer vào room chat với admin về đơn hàng.
- Events: `join-room`, `send-message`, `leave-room`, `new-message` (server push)

---

## 6. API Design

### 6.1 Response Format

```typescript
// Thành công
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Thất bại
interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
  path: string;
}
```

### 6.2 Endpoints Summary

#### Auth
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | /api/auth/register | Public | Đăng ký tài khoản |
| POST | /api/auth/login | Public | Đăng nhập, trả accessToken + refreshToken |
| POST | /api/auth/refresh-token | Public | Làm mới accessToken |
| POST | /api/auth/logout | JWT | Revoke refreshToken |
| POST | /api/auth/forgot-password | Public | Gửi email reset password |
| POST | /api/auth/reset-password | Public | Đặt lại mật khẩu |

#### User
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | /api/users/me | JWT | Lấy profile |
| PATCH | /api/users/me | JWT | Cập nhật profile |
| GET | /api/users/addresses | JWT | Danh sách địa chỉ |
| POST | /api/users/addresses | JWT | Thêm địa chỉ |
| PATCH | /api/users/addresses/:id | JWT | Sửa địa chỉ |
| DELETE | /api/users/addresses/:id | JWT | Xóa địa chỉ |

#### Product (Public)
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | /api/products | Public | Danh sách (filter, sort, pagination, search) |
| GET | /api/products/:slug | Public | Chi tiết sản phẩm |
| GET | /api/products/related/:id | Public | Sản phẩm liên quan |

#### Category (Public)
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | /api/categories | Public | Danh sách dạng tree |
| GET | /api/categories/:slug | Public | Chi tiết + sản phẩm thuộc nó |

#### Cart
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | /api/cart | JWT | Lấy giỏ hàng + items + tổng tiền |
| POST | /api/cart/items | JWT | Thêm sản phẩm vào giỏ |
| PATCH | /api/cart/items/:id | JWT | Cập nhật số lượng |
| DELETE | /api/cart/items/:id | JWT | Xóa item khỏi giỏ |
| DELETE | /api/cart | JWT | Xóa toàn bộ giỏ hàng |

#### Order
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | /api/orders | JWT | Tạo đơn hàng từ giỏ |
| GET | /api/orders | JWT | Danh sách đơn của tôi |
| GET | /api/orders/:id | JWT | Chi tiết đơn hàng |
| PATCH | /api/orders/:id/cancel | JWT | Hủy đơn (chỉ khi PENDING) |

#### Payment
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | /api/payments/create | JWT | Tạo URL thanh toán VNPay |
| GET | /api/payments/vnpay-return | Public | Callback từ VNPay |

#### Review
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | /api/reviews/product/:id | Public | Danh sách đánh giá |
| POST | /api/reviews | JWT | Tạo đánh giá |
| PATCH | /api/reviews/:id | JWT | Sửa đánh giá |
| DELETE | /api/reviews/:id | JWT | Xóa đánh giá |

#### Chat
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| WS | /chat | WS Token | Kết nối WebSocket |
| GET | /api/chat/rooms | JWT | Danh sách phòng chat |
| GET | /api/chat/rooms/:id/messages | JWT | Lịch sử tin nhắn |

#### Upload
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | /api/upload/image | JWT/Admin | Upload ảnh đơn |
| POST | /api/upload/images | JWT/Admin | Upload nhiều ảnh (max 5) |
| DELETE | /api/upload/:filename | Admin | Xóa ảnh |

#### Admin
| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | /api/admin/stats | Admin | Thống kê dashboard |
| GET | /api/admin/orders | Admin | Tất cả đơn hàng |
| PATCH | /api/admin/orders/:id/status | Admin | Cập nhật trạng thái đơn |
| GET | /api/admin/users | Admin | Quản lý users |
| PATCH | /api/admin/users/:id/role | Admin | Đổi role |
| POST | /api/admin/products | Admin | Thêm sản phẩm |
| PATCH | /api/admin/products/:id | Admin | Sửa sản phẩm |
| DELETE | /api/admin/products/:id | Admin | Xóa sản phẩm |
| POST | /api/admin/categories | Admin | Thêm category |
| PATCH | /api/admin/categories/:id | Admin | Sửa category |
| DELETE | /api/admin/categories/:id | Admin | Xóa category |

### 6.3 Pagination Convention

Query params: `?page=1&limit=20&sort=createdAt&order=DESC`
Response meta: `{ page, limit, total, totalPages }`

---

## 7. Security

- Password hash với bcrypt (salt rounds: 12)
- JWT access token (15 phút) + refresh token (7 ngày)
- Refresh token rotation (revoke token cũ khi tạo mới)
- Rate limiting (ThrottlerGuard: 100 request/phút cho API thường, 5 request/phút cho login)
- Helmet middleware (security headers)
- CORS whitelist (chỉ cho phép front-end origin)
- Input validation với class-validator (tất cả DTO)
- File upload: giới hạn 5MB/file, chỉ cho phép ảnh (jpg, png, webp)
- SQL injection prevention: dùng TypeORM parameterized queries

---

## 8. Lộ trình triển khai

9 giai đoạn, mỗi giai đoạn giới thiệu các khái niệm NestJS mới:

### Giai đoạn 1: Khởi tạo + Auth (Module, Controller, Provider, DI, Entity, Repository, Guard, Pipe)
- Khởi tạo NestJS + PostgreSQL + TypeORM
- Entity: User, RefreshToken
- Auth module: Register, Login, Refresh Token, Logout
- JwtAuthGuard, @Public, @CurrentUser
- Seed admin user
- Khởi tạo React + Vite + Tailwind + React Router
- Layout chính, Login/Register page, ProtectedRoute, Auth store

### Giai đoạn 2: Sản phẩm (Relations, QueryBuilder, Pagination, File Upload)
- Entity: Category (tree), Product, ProductImage, ProductVariant
- CRUD sản phẩm, upload ảnh (multer), serve static
- Filter, sort, search, pagination (QueryBuilder)
- Slug tự động
- Trang chủ, danh sách sản phẩm, chi tiết sản phẩm, search, filter
- Seed 20 sản phẩm mẫu

### Giai đoạn 3: Giỏ hàng + Đặt hàng (Transactions, ManyToMany)
- Entity: Cart, CartItem, Order, OrderItem, Address
- Cart API (CRUD, tính tiền)
- Order API (tạo đơn từ giỏ, transaction trừ kho)
- Trang giỏ hàng, checkout, danh sách đơn, chi tiết đơn

### Giai đoạn 4: Admin Dashboard (Role Guard, Interceptor, Custom Decorator)
- RolesGuard + @Roles('ADMIN')
- TransformInterceptor (bọc response)
- Admin dashboard thống kê
- CRUD sản phẩm, category, quản lý đơn hàng, quản lý user (admin)
- AdminLayout, DashboardPage, ProductManagePage, OrderManagePage

### Giai đoạn 5: Thanh toán VNPay (Third-party Integration)
- VNPay sandbox config (tmdt mã, hash secret)
- Tạo payment URL, HMAC SHA512 signing
- Callback/IPN xử lý kết quả
- Checkout page tích hợp chọn VNPay

### Giai đoạn 6: Đánh giá (Composite Key, Aggregate Query)
- Entity: Review (unique constraint user+product+order)
- API: tạo review (chỉ sau khi mua), danh sách review
- Form đánh giá star, danh sách review trong ProductDetail

### Giai đoạn 7: Real-time Chat (WebSocket Gateway, WsGuard, Socket.IO)
- ChatGateway (Socket.IO)
- WsJwtGuard xác thực WebSocket
- Entity: ChatRoom, ChatMessage
- ChatPage, useSocket hook
- Join room, send message, real-time push

### Giai đoạn 8: Backend nâng cao (Cache, Rate Limiting, Logging, Mail)
- Redis cache (product list, category tree)
- ThrottlerGuard (rate limiting)
- Winston logging (request + error log)
- Nodemailer (xác nhận đơn, quên mật khẩu)
- Auto-refresh token với Axios interceptor

### Giai đoạn 9: Hoàn thiện + Deploy
- Helmet + CORS config
- Swagger/OpenAPI docs
- TypeORM migrations
- Dockerfile (back-end + front-end)
- docker-compose (PostgreSQL + Redis + App)
- Nginx config cho production
- README.md hướng dẫn cài đặt và chạy

---

## 9. Testing Strategy

- Unit tests cho Service (Jest)
- E2E tests cho các luồng chính (đăng ký → đặt hàng)
- Integration tests cho API (supertest)
- Không bắt buộc coverage cụ thể, tập trung vào happy path

---

## 10. Environment Variables

```env
# back-end/.env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce

JWT_ACCESS_SECRET=your-access-secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your-refresh-secret
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

# front-end/.env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```
