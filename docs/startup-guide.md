# Hướng Dẫn Khởi Động Dự Án E-Commerce

> **Phiên bản**: 1.0.0  
> **Tech Stack**: NestJS 11 + React 19 + PostgreSQL 16 + Redis 7  
> **Tác giả**: E-Commerce Team

---

## 📋 Yêu Cầu Hệ Thống

| Công cụ | Phiên bản tối thiểu | Kiểm tra |
|---|---|---|
| **Node.js** | ^22.0.0 | `node --version` |
| **npm** | ^10.0.0 | `npm --version` |
| **Docker** | ^24.0.0 | `docker --version` |
| **Docker Compose** | ^2.20.0 | `docker compose version` |

> 💡 **Mẹo**: Nếu chưa cài Docker, tải tại [docker.com](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Quick Start (1 Lệnh Duy Nhất)

```bash
# Bước 1: Start database (PostgreSQL + Redis) bằng Docker
docker compose up -d postgres redis

# Bước 2: Khởi động cả Backend + Frontend cùng lúc
npm run dev
```

Sau đó truy cập:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs

---

## 🐳 Bước 1: Khởi Động Database

### Cách A — Dùng Docker Compose (Ưu tiên)

```bash
# Chỉ chạy database services (PostgreSQL + Redis)
docker compose up -d postgres redis

# Kiểm tra trạng thái
docker compose ps
```

### Cách B — Dùng Docker riêng từng service

```bash
# PostgreSQL
docker run -d --name ecommerce_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecommerce \
  -p 5432:5432 \
  postgres:16-alpine

# Redis
docker run -d --name ecommerce_redis \
  -p 6379:6379 \
  redis:7-alpine
```

> ✅ **Kiểm tra**: `docker ps` — cả 2 container phải có status `Up`

---

## 🔧 Bước 2: Cấu Hình Môi Trường

File `.env` ở `back-end/.env` đã được cấu hình sẵn cho development:

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
```

Không cần chỉnh sửa gì thêm cho môi trường dev.

---

## 🚀 Bước 3: Khởi Động Ứng Dụng

### Cách 1 — Chạy đồng thời (Khuyên dùng)

Từ thư mục gốc của dự án:

```bash
npm run dev
```

Lệnh này sử dụng `concurrently` để chạy cả 2 service trong **cùng một terminal**:

| Service | Command | Port |
|---|---|---|
| **Backend** (NestJS) | `npm run start:dev --prefix back-end` | `:3000` |
| **Frontend** (Vite) | `npm run dev --prefix front-end` | `:5173` |

Nhấn `Ctrl+C` để dừng cả hai.

### Cách 2 — Chạy riêng từng service (2 terminal)

**Terminal 1 — Backend:**
```bash
cd back-end
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd front-end
npm run dev
```

> 💡 **Gợi ý**: Vite tự động proxy `/api` → `localhost:3000`, nên bạn không cần lo về CORS khi development.

---

## 🌱 Bước 4: Seed Dữ Liệu Mẫu

Sau khi backend đã chạy, mở terminal mới và chạy:

```bash
# Tạo tài khoản admin
npm run seed:admin

# Tạo sản phẩm mẫu
npm run seed:product
```

Dữ liệu mẫu bao gồm:
- **Admin**: `admin@ecommerce.com` (kiểm tra trong file seed để biết password)
- **Sản phẩm**: Danh mục + sản phẩm + hình ảnh mẫu
- **Danh mục**: Categories mặc định

---

## 🔍 Kiểm Tra Hoạt Động

### 1. Backend API

```bash
curl http://localhost:3000/api/products
# Response: { "success": true, "data": [...] }
```

### 2. Swagger Documentation

Mở trình duyệt: http://localhost:3000/api/docs

Giao diện Swagger UI cho phép:
- Xem tất cả API endpoints
- Test request trực tiếp (có hỗ trợ Bearer Token)
- Xem schema DTO và Entity

### 3. Frontend

Mở trình duyệt: http://localhost:5173

---

## 🧪 Các Lệnh Hữu Ích Khác

```bash
# Chạy unit tests (backend)
npm run test --prefix back-end

# Build cho production
npm run build

# Chạy production (sau khi build)
npm run start:prod --prefix back-end

# Lint toàn bộ backend
npm run lint
```

---

## 🐳 Deploy Với Docker Compose (Production)

Nếu muốn chạy toàn bộ hệ thống (DB + Backend + Frontend) trong container:

```bash
# Build và chạy tất cả services
docker compose up -d --build

# Kiểm tra
docker compose ps

# Xem log
docker compose logs -f backend
```

Lúc này frontend phục vụ qua **Nginx** ở port **80**:
- http://localhost (Frontend)
- http://localhost:3000/api (API)
- http://localhost:3000/api/docs (Swagger)

---

## ❌ Xử Lý Sự Cố Thường Gặp

| Vấn đề | Nguyên nhân | Giải pháp |
|---|---|---|
| `ECONNREFUSED :5432` | PostgreSQL chưa chạy | `docker compose up -d postgres` |
| `ECONNREFUSED :6379` | Redis chưa chạy | `docker compose up -d redis` |
| `JWT_SECRET not found` | Thiếu .env file | Copy `.env.example` → `.env` |
| `Port 3000 already in use` | Có app khác dùng port 3000 | Đổi PORT trong .env hoặc tắt app cũ |
| Docker không start | Docker Desktop chưa chạy | Mở Docker Desktop từ Start Menu |

---

## 📁 Cấu Trúc Thư Mục

```
F:\Projects\E-Commerce/
├── package.json          # Root — chạy đồng thời BE + FE
├── docker-compose.yml    # Docker orchestration
├── back-end/             # NestJS API
│   ├── src/
│   │   ├── modules/      # 14 feature modules
│   │   ├── common/       # Guards, decorators, filters, interceptors
│   │   ├── config/       # App configuration
│   │   └── seeds/        # Seed scripts
│   └── package.json
├── front-end/            # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/        # 15 pages
│   │   ├── components/   # UI + layout components
│   │   ├── api/          # Axios API modules
│   │   ├── store/        # Zustand stores
│   │   └── router/       # React Router config
│   └── package.json
└── docs/                 # Tài liệu dự án
```

---

## 🎯 Tóm Tắt Luồng Khởi Động

```
1. Docker Desktop chạy
       ↓
2. docker compose up -d postgres redis
       ↓
3. npm run dev
       ↓
4. Backend :3000  ←──→  PostgreSQL :5432
                       Redis :6379
       ↓
5. Frontend :5173  ←── (proxy) ──→  Backend :3000
       ↓
6. npm run seed:admin  &  npm run seed:product
       ↓
7. ✓ Sẵn sàng!
```

> ⚡ **Tổng thời gian khởi động**: ~30 giây (lần đầu có thể lâu hơn do build Docker images)
