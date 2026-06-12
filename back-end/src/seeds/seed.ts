import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';
import { OrderStatus } from '../modules/order/entities/order.entity';
import { User } from '../modules/user/entities/user.entity';
import { Address } from '../modules/user/entities/address.entity';
import { Category } from '../modules/category/entities/category.entity';
import { Product } from '../modules/product/entities/product.entity';
import { ProductImage } from '../modules/product/entities/product-image.entity';
import { ProductVariant } from '../modules/product/entities/product-variant.entity';
import { Order } from '../modules/order/entities/order.entity';
import { OrderItem } from '../modules/order/entities/order-item.entity';
import { Review } from '../modules/review/entities/review.entity';
import { Cart } from '../modules/cart/entities/cart.entity';
import { CartItem } from '../modules/cart/entities/cart-item.entity';
import { randomUUID } from 'crypto';

// ══════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/-+/g, '-');
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function hoursAgo(hours: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

// ══════════════════════════════════════════════
// USER DATA
// ══════════════════════════════════════════════

const USERS = [
  {
    email: 'admin@ecommerce.com',
    fullName: 'Quản trị viên',
    password: 'admin123',
    role: Role.ADMIN,
    phone: '0901234567',
    addresses: [
      { fullName: 'Quản trị viên', phone: '0901234567', province: 'Hà Nội', district: 'Cầu Giấy', ward: 'Dịch Vọng', detail: 'Số 1, ngõ 2 đường Cầu Giấy', isDefault: true },
    ],
  },
  {
    email: 'nguyenvanan@email.com',
    fullName: 'Nguyễn Văn An',
    password: 'password123',
    role: Role.USER,
    phone: '0912345678',
    addresses: [
      { fullName: 'Nguyễn Văn An', phone: '0912345678', province: 'Hà Nội', district: 'Đống Đa', ward: 'Thổ Quan', detail: '123 phố Tôn Đức Thắng', isDefault: true },
      { fullName: 'Nguyễn Văn An', phone: '0912345678', province: 'Hồ Chí Minh', district: 'Quận 1', ward: 'Bến Nghé', detail: '45 Lê Lợi', isDefault: false },
    ],
  },
  {
    email: 'tranthibich@email.com',
    fullName: 'Trần Thị Bích',
    password: 'password123',
    role: Role.USER,
    phone: '0923456789',
    addresses: [
      { fullName: 'Trần Thị Bích', phone: '0923456789', province: 'Hồ Chí Minh', district: 'Quận 3', ward: 'Võ Thị Sáu', detail: '78 Nguyễn Đình Chiểu', isDefault: true },
    ],
  },
  {
    email: 'lehoangcuong@email.com',
    fullName: 'Lê Hoàng Cường',
    password: 'password123',
    role: Role.USER,
    phone: '0934567890',
    addresses: [
      { fullName: 'Lê Hoàng Cường', phone: '0934567890', province: 'Đà Nẵng', district: 'Hải Châu', ward: 'Bình Thuận', detail: '56 Nguyễn Văn Linh', isDefault: true },
      { fullName: 'Lê Hoàng Cường', phone: '0934567890', province: 'Hồ Chí Minh', district: 'Quận 7', ward: 'Tân Phong', detail: '12 Nguyễn Lương Bằng', isDefault: false },
    ],
  },
  {
    email: 'phamminhduc@email.com',
    fullName: 'Phạm Minh Đức',
    password: 'password123',
    role: Role.USER,
    phone: '0945678901',
    addresses: [
      { fullName: 'Phạm Minh Đức', phone: '0945678901', province: 'Hà Nội', district: 'Thanh Xuân', ward: 'Thanh Xuân Trung', detail: '89 Nguyễn Trãi', isDefault: true },
    ],
  },
  {
    email: 'hoangthem@email.com',
    fullName: 'Hoàng Thị Em',
    password: 'password123',
    role: Role.USER,
    phone: '0956789012',
    addresses: [
      { fullName: 'Hoàng Thị Em', phone: '0956789012', province: 'Hải Phòng', district: 'Ngô Quyền', ward: 'Lạch Tray', detail: '34 Nguyễn Bỉnh Khiêm', isDefault: true },
    ],
  },
  {
    email: 'doducphong@email.com',
    fullName: 'Đỗ Đức Phong',
    password: 'password123',
    role: Role.USER,
    phone: '0967890123',
    addresses: [
      { fullName: 'Đỗ Đức Phong', phone: '0967890123', province: 'Hà Nội', district: 'Ba Đình', ward: 'Ngọc Hà', detail: '67 Hoàng Hoa Thám', isDefault: true },
    ],
  },
  {
    email: 'vuthiha@email.com',
    fullName: 'Vũ Thị Hà',
    password: 'password123',
    role: Role.USER,
    phone: '0978901234',
    addresses: [
      { fullName: 'Vũ Thị Hà', phone: '0978901234', province: 'Hồ Chí Minh', district: 'Thủ Đức', ward: 'Linh Đông', detail: '23 Võ Văn Ngân', isDefault: true },
    ],
  },
];

// ══════════════════════════════════════════════
// CATEGORY DATA
// ══════════════════════════════════════════════

const CATEGORIES: { name: string; description: string; children: { name: string; description: string }[] }[] = [
  {
    name: 'Điện thoại', description: 'Điện thoại thông minh chính hãng',
    children: [
      { name: 'iPhone', description: 'Apple iPhone' },
      { name: 'Samsung', description: 'Samsung Galaxy' },
      { name: 'Xiaomi', description: 'Xiaomi Redmi' },
      { name: 'OPPO', description: 'OPPO Reno, Find' },
    ],
  },
  {
    name: 'Laptop', description: 'Laptop văn phòng và gaming',
    children: [
      { name: 'MacBook', description: 'Apple MacBook' },
      { name: 'Dell', description: 'Dell Inspiron, XPS' },
      { name: 'ASUS', description: 'ASUS ZenBook, TUF' },
      { name: 'HP', description: 'HP Pavilion, Spectre' },
      { name: 'Lenovo', description: 'Lenovo ThinkPad, Legion' },
    ],
  },
  {
    name: 'Phụ kiện', description: 'Phụ kiện công nghệ',
    children: [
      { name: 'Tai nghe', description: 'Tai nghe có dây, không dây' },
      { name: 'Sạc dự phòng', description: 'Pin sạc dự phòng' },
      { name: 'Ốp lưng', description: 'Ốp lưng điện thoại' },
      { name: 'Cáp sạc', description: 'Cáp sạc các loại' },
      { name: 'Chuột & Bàn phím', description: 'Chuột, bàn phím máy tính' },
    ],
  },
  {
    name: 'Đồng hồ thông minh', description: 'Smartwatch, đồng hồ thông minh',
    children: [
      { name: 'Apple Watch', description: 'Apple Watch Series, Ultra' },
      { name: 'Samsung Watch', description: 'Samsung Galaxy Watch' },
      { name: 'Xiaomi Watch', description: 'Xiaomi Smart Band, Watch' },
    ],
  },
  {
    name: 'Máy tính bảng', description: 'Tablet chính hãng',
    children: [
      { name: 'iPad', description: 'Apple iPad' },
      { name: 'Samsung Tab', description: 'Samsung Galaxy Tab' },
      { name: 'Xiaomi Pad', description: 'Xiaomi Pad' },
    ],
  },
];

// ══════════════════════════════════════════════
// PRODUCT DATA
// ══════════════════════════════════════════════

const PRODUCTS = [
  // ── iPhone ──
  {
    name: 'iPhone 16 Pro Max 256GB',
    description: 'Apple A18 Pro, 8GB RAM, 256GB, 48MP Camera chính, màn hình 6.9" OLED 120Hz, pin 4685mAh, Titanium thiết kế siêu bền.',
    price: 33990000, comparePrice: 35990000, quantity: 80, sold: 45, categoryKey: 'iphone', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/iphone16pm-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/iphone16pm-2/600/600', isThumbnail: false, sortOrder: 1 },
      { url: 'https://picsum.photos/seed/iphone16pm-3/600/600', isThumbnail: false, sortOrder: 2 },
    ],
    variants: [
      { name: 'Màu sắc', value: 'Titan tự nhiên', price: undefined, quantity: 30 },
      { name: 'Màu sắc', value: 'Titan xanh', price: undefined, quantity: 25 },
      { name: 'Màu sắc', value: 'Titan trắng', price: undefined, quantity: 25 },
    ],
  },
  {
    name: 'iPhone 16 Pro 128GB',
    description: 'Apple A18 Pro, 8GB RAM, 128GB, 48MP Camera, màn hình 6.3" OLED 120Hz.',
    price: 27990000, comparePrice: 29990000, quantity: 60, sold: 32, categoryKey: 'iphone', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/iphone16p-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/iphone16p-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'iPhone 16 128GB',
    description: 'Apple A18, 6GB RAM, 128GB, màn hình 6.1" OLED, Camera kép 48MP.',
    price: 22990000, comparePrice: undefined, quantity: 70, sold: 28, categoryKey: 'iphone', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/iphone16-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/iphone16-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [
      { name: 'Màu sắc', value: 'Hồng', price: undefined, quantity: 25 },
      { name: 'Màu sắc', value: 'Xanh', price: undefined, quantity: 25 },
      { name: 'Màu sắc', value: 'Đen', price: undefined, quantity: 20 },
    ],
  },
  {
    name: 'iPhone 15 128GB',
    description: 'Apple A16, 6GB RAM, 128GB, màn hình 6.1" OLED, Camera 48MP. Giá siêu ưu đãi.',
    price: 17990000, comparePrice: 19990000, quantity: 90, sold: 55, categoryKey: 'iphone', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/iphone15-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/iphone15-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  // ── Samsung ──
  {
    name: 'Samsung Galaxy S25 Ultra',
    description: 'Snapdragon 8 Elite, 12GB RAM, 256GB, S Pen, Camera 200MP, màn hình 6.9" Dynamic AMOLED 2X 120Hz.',
    price: 28990000, comparePrice: 30990000, quantity: 50, sold: 22, categoryKey: 'samsung', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/s25ultra-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/s25ultra-2/600/600', isThumbnail: false, sortOrder: 1 },
      { url: 'https://picsum.photos/seed/s25ultra-3/600/600', isThumbnail: false, sortOrder: 2 },
    ],
    variants: [
      { name: 'Màu sắc', value: 'Bạc', price: undefined, quantity: 18 },
      { name: 'Màu sắc', value: 'Đen', price: undefined, quantity: 18 },
      { name: 'Màu sắc', value: 'Xanh dương', price: undefined, quantity: 14 },
    ],
  },
  {
    name: 'Samsung Galaxy S25+',
    description: 'Snapdragon 8 Elite, 12GB RAM, 256GB, màn hình 6.7" Dynamic AMOLED 120Hz.',
    price: 19990000, comparePrice: 21990000, quantity: 40, sold: 15, categoryKey: 'samsung', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/s25plus-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/s25plus-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Exynos 2400, 8GB RAM, 128GB, màn hình 6.2" FHD+ Dynamic AMOLED 120Hz.',
    price: 15990000, comparePrice: 17990000, quantity: 55, sold: 38, categoryKey: 'samsung', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/s24-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/s24-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [
      { name: 'Màu sắc', value: 'Bạc', price: undefined, quantity: 20 },
      { name: 'Màu sắc', value: 'Đen', price: undefined, quantity: 20 },
      { name: 'Màu sắc', value: 'Tím', price: undefined, quantity: 15 },
    ],
  },
  {
    name: 'Samsung Galaxy A55 5G',
    description: 'Exynos 1480, 8GB RAM, 256GB, màn hình Super AMOLED 6.6" 120Hz, pin 5000mAh.',
    price: 8990000, comparePrice: undefined, quantity: 100, sold: 60, categoryKey: 'samsung', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/a55-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  // ── Xiaomi ──
  {
    name: 'Xiaomi 14T 512GB',
    description: 'MediaTek Dimensity 8300-Ultra, 12GB RAM, 512GB, Camera Leica 50MP, màn hình 6.67" AMOLED 144Hz.',
    price: 12990000, comparePrice: 14990000, quantity: 35, sold: 18, categoryKey: 'xiaomi', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/xiaomi14t-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/xiaomi14t-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'Xiaomi Redmi Note 14 Pro',
    description: 'MediaTek Dimensity 7200, 8GB RAM, 256GB, Camera 200MP, pin 5000mAh, sạc 67W.',
    price: 8990000, comparePrice: undefined, quantity: 80, sold: 42, categoryKey: 'xiaomi', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/redminote14pro-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/redminote14pro-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'Xiaomi Redmi Note 14',
    description: 'MediaTek Helio G99, 8GB RAM, 128GB, màn hình AMOLED 6.67" 120Hz, pin 5000mAh.',
    price: 5490000, comparePrice: undefined, quantity: 120, sold: 70, categoryKey: 'xiaomi', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/redminote14-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  // ── MacBook ──
  {
    name: 'MacBook Pro 14 M4 Pro',
    description: 'Apple M4 Pro, 18GB Unified Memory, 512GB SSD, màn hình 14.2" Liquid Retina XDR, 22h pin.',
    price: 45990000, comparePrice: 48990000, quantity: 25, sold: 12, categoryKey: 'macbook', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/mbp14-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/mbp14-2/600/600', isThumbnail: false, sortOrder: 1 },
      { url: 'https://picsum.photos/seed/mbp14-3/600/600', isThumbnail: false, sortOrder: 2 },
    ],
    variants: [
      { name: 'Màu sắc', value: 'Bạc', price: undefined, quantity: 12 },
      { name: 'Màu sắc', value: 'Xám không gian', price: undefined, quantity: 13 },
    ],
  },
  {
    name: 'MacBook Air M3 13"',
    description: 'Apple M3, 8GB Unified Memory, 256GB SSD, màn hình 13.6" Liquid Retina, 18h pin, siêu nhẹ 1.24kg.',
    price: 24990000, comparePrice: 26990000, quantity: 40, sold: 25, categoryKey: 'macbook', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/mba13-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/mba13-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [
      { name: 'Màu sắc', value: 'Bạc', price: undefined, quantity: 15 },
      { name: 'Màu sắc', value: 'Xám không gian', price: undefined, quantity: 15 },
      { name: 'Màu sắc', value: 'Vàng', price: undefined, quantity: 10 },
    ],
  },
  {
    name: 'MacBook Air M2 13"',
    description: 'Apple M2, 8GB Unified Memory, 256GB SSD, màn hình 13.6" Liquid Retina, MagSafe. Giá giảm sâu.',
    price: 19990000, comparePrice: 23990000, quantity: 35, sold: 20, categoryKey: 'macbook', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/mba13m2-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  // ── Dell ──
  {
    name: 'Dell XPS 15 OLED',
    description: 'Intel Core Ultra 9, 32GB RAM, 1TB SSD, màn hình 15.6" OLED 3.5K Touch, RTX 4070.',
    price: 39990000, comparePrice: undefined, quantity: 18, sold: 8, categoryKey: 'dell', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/xps15-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/xps15-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'Dell Inspiron 16 5640',
    description: 'Intel Core i7-1360P, 16GB RAM, 512GB SSD, màn hình 16" WUXGA, pin 6 cell.',
    price: 19990000, comparePrice: undefined, quantity: 30, sold: 14, categoryKey: 'dell', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/inspiron16-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  // ── ASUS ──
  {
    name: 'ASUS ZenBook 14 OLED',
    description: 'Intel Core Ultra 7, 16GB RAM, 512GB SSD, màn hình 14" 2.8K OLED 120Hz, siêu nhẹ 1.2kg.',
    price: 22990000, comparePrice: undefined, quantity: 25, sold: 15, categoryKey: 'asus', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/zenbook14-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/zenbook14-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'ASUS TUF Gaming F15',
    description: 'Intel Core i7-12700H, RTX 4060 6GB, 16GB RAM, 512GB SSD, màn hình 15.6" 144Hz.',
    price: 25990000, comparePrice: undefined, quantity: 22, sold: 17, categoryKey: 'asus', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/tuff15-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/tuff15-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  // ── Phụ kiện ──
  {
    name: 'AirPods Pro 2 USB-C',
    description: 'Chống ồn chủ động, Spatial Audio, chip H2, chống nước IPX4, thời lượng pin 30h.',
    price: 5990000, comparePrice: 6490000, quantity: 120, sold: 85, categoryKey: 'tai-nghe', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/airpodspro2-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/airpodspro2-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'Samsung Galaxy Buds 3 Pro',
    description: 'Chống ồn thông minh, 360 Audio, LED Blade, IP57, pin 26h, âm thanh Hi-Fi.',
    price: 4290000, comparePrice: 4790000, quantity: 90, sold: 50, categoryKey: 'tai-nghe', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/buds3pro-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/buds3pro-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Chống ồn chủ động hàng đầu, driver 30mm, pin 40h, gập gọn, đàm thoại AI.',
    price: 7990000, comparePrice: undefined, quantity: 40, sold: 22, categoryKey: 'tai-nghe', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/wh1000xm5-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  {
    name: 'Sạc dự phòng Anker PowerCore 20000mAh',
    description: 'Dung lượng 20000mAh, PD 20W, cổng USB-C, nhỏ gọn, an toàn tuyệt đối.',
    price: 890000, comparePrice: undefined, quantity: 200, sold: 150, categoryKey: 'sac-du-phong', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/anker20k-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  {
    name: 'Sạc dự phòng Xiaomi 10000mAh',
    description: 'Mỏng nhẹ 200g, PD 20W, cổng USB-C + USB-A, phù hợp mang theo hàng ngày.',
    price: 450000, comparePrice: undefined, quantity: 250, sold: 180, categoryKey: 'sac-du-phong', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/xiaomi10k-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  {
    name: 'Ốp lưng Silicon iPhone 15 Pro Max',
    description: 'Chất liệu silicon mềm mại, chống sốc, MagSafe, đầy đủ màu sắc.',
    price: 199000, comparePrice: undefined, quantity: 600, sold: 420, categoryKey: 'op-lung', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/oplungip15pm-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [
      { name: 'Màu sắc', value: 'Xanh navy', price: undefined, quantity: 150 },
      { name: 'Màu sắc', value: 'Hồng', price: undefined, quantity: 150 },
      { name: 'Màu sắc', value: 'Đen', price: undefined, quantity: 150 },
      { name: 'Màu sắc', value: 'Trắng', price: undefined, quantity: 150 },
    ],
  },
  {
    name: 'Ốp lưng trong suốt Samsung S25 Ultra',
    description: 'TPU siêu trong, chống ố vàng, chống sốc, viền mềm, bảo vệ toàn diện.',
    price: 149000, comparePrice: undefined, quantity: 500, sold: 320, categoryKey: 'op-lung', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/oplungs25u-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  {
    name: 'Cáp Type-C Anker 1m',
    description: 'Cáp USB-C to C, PD 60W, tốc độ 480Mbps, bện dù chắc chắn.',
    price: 199000, comparePrice: undefined, quantity: 400, sold: 280, categoryKey: 'cap-sac', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/ankercable-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  {
    name: 'Cáp Lightning Apple 1m',
    description: 'Cáp sạc Lightning chính hãng Apple, MFi certified, sạc nhanh 20W.',
    price: 499000, comparePrice: undefined, quantity: 300, sold: 200, categoryKey: 'cap-sac', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/applelightning-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  // ── Đồng hồ ──
  {
    name: 'Apple Watch Ultra 2',
    description: 'Màn hình 49mm, chip S9, vỏ titanium, pin 36h, GPS chính xác, lặn 40m.',
    price: 19990000, comparePrice: undefined, quantity: 20, sold: 8, categoryKey: 'apple-watch', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/awu2-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/awu2-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'Apple Watch Series 9 GPS',
    description: 'Màn hình Always-On Retina LTPO, chip S9, cảm biến sức khỏe, pin 18h.',
    price: 10990000, comparePrice: 12990000, quantity: 35, sold: 18, categoryKey: 'apple-watch', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/aws9-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [
      { name: 'Kích cỡ', value: '41mm', price: undefined, quantity: 18 },
      { name: 'Kích cỡ', value: '45mm', price: undefined, quantity: 17 },
    ],
  },
  {
    name: 'Samsung Galaxy Watch 7',
    description: 'Màn hình Super AMOLED, chip Exynos W1000, BioActive Sensor, Wear OS, pin 40h.',
    price: 7990000, comparePrice: undefined, quantity: 30, sold: 14, categoryKey: 'sam-sung-watch', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/gw7-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  // ── Máy tính bảng ──
  {
    name: 'iPad Pro M4 11" WiFi',
    description: 'Apple M4, 8GB RAM, 256GB, màn hình Ultra Retina XDR 11", Thunderbolt, Face ID.',
    price: 27990000, comparePrice: undefined, quantity: 20, sold: 9, categoryKey: 'ipad', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/ipadprom4-1/600/600', isThumbnail: true, sortOrder: 0 },
      { url: 'https://picsum.photos/seed/ipadprom4-2/600/600', isThumbnail: false, sortOrder: 1 },
    ],
    variants: [],
  },
  {
    name: 'iPad Air M2 11"',
    description: 'Apple M2, 8GB RAM, 128GB, màn hình Liquid Retina 11", Touch ID, camera 12MP.',
    price: 16990000, comparePrice: undefined, quantity: 30, sold: 16, categoryKey: 'ipad', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/ipadairm2-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
  {
    name: 'Samsung Galaxy Tab S9+ 5G',
    description: 'Snapdragon 8 Gen 2, 12GB RAM, 256GB, màn hình 12.4" Dynamic AMOLED 2X 120Hz, S Pen.',
    price: 19990000, comparePrice: undefined, quantity: 18, sold: 8, categoryKey: 'sam-sung-tab', isActive: true,
    images: [
      { url: 'https://picsum.photos/seed/tabs9plus-1/600/600', isThumbnail: true, sortOrder: 0 },
    ],
    variants: [],
  },
];

// ══════════════════════════════════════════════
// ORDER DATA
// ══════════════════════════════════════════════

const ORDERS: {
  userKey: string; status: OrderStatus;
  items: { productName: string; variantValue: string | undefined; quantity: number; price: number }[];
  note: string | undefined; daysAgo: number; hoursAgo: number | undefined;
}[] = [
  {
    userKey: 'nguyenvanan@email.com', status: OrderStatus.DELIVERED,
    items: [
      { productName: 'iPhone 16 Pro Max 256GB', variantValue: 'Titan tự nhiên', quantity: 1, price: 33990000 },
      { productName: 'Ốp lưng Silicon iPhone 15 Pro Max', variantValue: 'Xanh navy', quantity: 2, price: 199000 },
    ],
    note: undefined, daysAgo: 30, hoursAgo: undefined,
  },
  {
    userKey: 'nguyenvanan@email.com', status: OrderStatus.SHIPPING,
    items: [
      { productName: 'MacBook Air M3 13"', variantValue: 'Bạc', quantity: 1, price: 24990000 },
    ],
    note: 'Giao hàng giờ hành chính', daysAgo: 5, hoursAgo: undefined,
  },
  {
    userKey: 'nguyenvanan@email.com', status: OrderStatus.PENDING,
    items: [
      { productName: 'AirPods Pro 2 USB-C', variantValue: undefined, quantity: 1, price: 5990000 },
    ],
    note: undefined, daysAgo: 0, hoursAgo: 2,
  },
  {
    userKey: 'tranthibich@email.com', status: OrderStatus.DELIVERED,
    items: [
      { productName: 'Samsung Galaxy S25 Ultra', variantValue: 'Bạc', quantity: 1, price: 28990000 },
    ],
    note: 'Gọi trước khi giao', daysAgo: 15, hoursAgo: undefined,
  },
  {
    userKey: 'tranthibich@email.com', status: OrderStatus.CANCELLED,
    items: [
      { productName: 'iPhone 15 128GB', variantValue: undefined, quantity: 1, price: 17990000 },
      { productName: 'Ốp lưng Silicon iPhone 15 Pro Max', variantValue: 'Hồng', quantity: 1, price: 199000 },
    ],
    note: 'Đổi ý không mua nữa', daysAgo: 7, hoursAgo: undefined,
  },
  {
    userKey: 'lehoangcuong@email.com', status: OrderStatus.DELIVERED,
    items: [
      { productName: 'ASUS TUF Gaming F15', variantValue: undefined, quantity: 1, price: 25990000 },
      { productName: 'Sạc dự phòng Anker PowerCore 20000mAh', variantValue: undefined, quantity: 1, price: 890000 },
    ],
    note: undefined, daysAgo: 20, hoursAgo: undefined,
  },
  {
    userKey: 'lehoangcuong@email.com', status: OrderStatus.CONFIRMED,
    items: [
      { productName: 'Sony WH-1000XM5', variantValue: undefined, quantity: 1, price: 7990000 },
    ],
    note: undefined, daysAgo: 2, hoursAgo: undefined,
  },
  {
    userKey: 'phamminhduc@email.com', status: OrderStatus.PENDING,
    items: [
      { productName: 'Xiaomi Redmi Note 14 Pro', variantValue: undefined, quantity: 2, price: 8990000 },
      { productName: 'Sạc dự phòng Xiaomi 10000mAh', variantValue: undefined, quantity: 1, price: 450000 },
    ],
    note: 'Mang theo hóa đơn', daysAgo: 0, hoursAgo: 6,
  },
  {
    userKey: 'hoangthem@email.com', status: OrderStatus.DELIVERED,
    items: [
      { productName: 'Samsung Galaxy A55 5G', variantValue: undefined, quantity: 1, price: 8990000 },
    ],
    note: undefined, daysAgo: 10, hoursAgo: undefined,
  },
  {
    userKey: 'hoangthem@email.com', status: OrderStatus.SHIPPING,
    items: [
      { productName: 'Samsung Galaxy Buds 3 Pro', variantValue: undefined, quantity: 1, price: 4290000 },
    ],
    note: undefined, daysAgo: 3, hoursAgo: undefined,
  },
  {
    userKey: 'doducphong@email.com', status: OrderStatus.DELIVERED,
    items: [
      { productName: 'iPhone 16 Pro 128GB', variantValue: undefined, quantity: 1, price: 27990000 },
      { productName: 'Apple Watch Series 9 GPS', variantValue: '45mm', quantity: 1, price: 10990000 },
    ],
    note: 'Giao vào cuối tuần', daysAgo: 25, hoursAgo: undefined,
  },
  {
    userKey: 'vuthiha@email.com', status: OrderStatus.DELIVERED,
    items: [
      { productName: 'MacBook Air M2 13"', variantValue: undefined, quantity: 1, price: 19990000 },
    ],
    note: undefined, daysAgo: 5, hoursAgo: undefined,
  },
  {
    userKey: 'vuthiha@email.com', status: OrderStatus.PENDING,
    items: [
      { productName: 'iPad Air M2 11"', variantValue: undefined, quantity: 1, price: 16990000 },
      { productName: 'Cáp Type-C Anker 1m', variantValue: undefined, quantity: 2, price: 199000 },
    ],
    note: undefined, daysAgo: 0, hoursAgo: 1,
  },
];

// ══════════════════════════════════════════════
// REVIEW DATA
// ══════════════════════════════════════════════

const REVIEWS: { userKey: string; productKey: string; rating: number; comment: string; daysAgo: number }[] = [
  { userKey: 'nguyenvanan@email.com', productKey: 'iphone-16-pro-max-256gb', rating: 5, comment: 'Máy đẹp, chụp ảnh siêu nét, pin trâu. Rất hài lòng!', daysAgo: 28 },
  { userKey: 'nguyenvanan@email.com', productKey: 'op-lung-silicon-iphone-15-pro-max', rating: 4, comment: 'Ốp lưng tốt, ôm máy chặt, chất liệu silicon mềm.', daysAgo: 28 },
  { userKey: 'tranthibich@email.com', productKey: 'samsung-galaxy-s25-ultra', rating: 5, comment: 'Sản phẩm tuyệt vời! Màn hình đẹp, camera siêu nét, S Pen tiện lợi.', daysAgo: 13 },
  { userKey: 'lehoangcuong@email.com', productKey: 'asus-tuf-gaming-f15', rating: 4, comment: 'Máy chơi game mượt, tản nhiệt tốt. Hơi nặng so với dân văn phòng.', daysAgo: 18 },
  { userKey: 'hoangthem@email.com', productKey: 'samsung-galaxy-a55-5g', rating: 5, comment: 'Pin trâu, chụp ảnh đẹp, màn hình sáng. Giá rất hợp lý!', daysAgo: 8 },
  { userKey: 'doducphong@email.com', productKey: 'iphone-16-pro-128gb', rating: 5, comment: 'Chính hãng, máy mới, đầy đủ phụ kiện. Sẽ ủng hộ shop tiếp.', daysAgo: 23 },
  { userKey: 'doducphong@email.com', productKey: 'apple-watch-series-9-gps', rating: 4, comment: 'Đồng hồ đẹp, nhiều tính năng sức khỏe. Pin dùng được 2 ngày.', daysAgo: 23 },
  { userKey: 'vuthiha@email.com', productKey: 'macbook-air-m2-13', rating: 5, comment: 'MacBook siêu nhẹ, pin dùng cả ngày, màn hình đẹp xuất sắc!', daysAgo: 3 },
];

// ══════════════════════════════════════════════
// CART ITEM DATA
// ══════════════════════════════════════════════

const CART_ITEMS: { userKey: string; productKey: string; quantity: number }[] = [
  { userKey: 'nguyenvanan@email.com', productKey: 'samsung-galaxy-buds-3-pro', quantity: 1 },
  { userKey: 'tranthibich@email.com', productKey: 'ipad-air-m2-11', quantity: 1 },
  { userKey: 'lehoangcuong@email.com', productKey: 'dell-xps-15-oled', quantity: 1 },
  { userKey: 'phamminhduc@email.com', productKey: 'iphone-16-128gb', quantity: 1 },
  { userKey: 'hoangthem@email.com', productKey: 'xiaomi-redmi-note-14', quantity: 1 },
  { userKey: 'vuthiha@email.com', productKey: 'apple-watch-ultra-2', quantity: 1 },
];

// ══════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ds = app.get(DataSource);

  const userRepo: Repository<User> = ds.getRepository(User);
  const addressRepo: Repository<Address> = ds.getRepository(Address);
  const categoryRepo: Repository<Category> = ds.getRepository(Category);
  const productRepo: Repository<Product> = ds.getRepository(Product);
  const productImageRepo: Repository<ProductImage> = ds.getRepository(ProductImage);
  const productVariantRepo: Repository<ProductVariant> = ds.getRepository(ProductVariant);
  const orderRepo: Repository<Order> = ds.getRepository(Order);
  const orderItemRepo: Repository<OrderItem> = ds.getRepository(OrderItem);
  const reviewRepo: Repository<Review> = ds.getRepository(Review);
  const cartRepo: Repository<Cart> = ds.getRepository(Cart);
  const cartItemRepo: Repository<CartItem> = ds.getRepository(CartItem);

  const START = Date.now();
  console.log('🌱 Bắt đầu seed dữ liệu...\n');

  // ════════════════════
  // 1. USERS
  // ════════════════════
  console.log('📦 [1/7] Đang tạo người dùng...');
  const userMap = new Map<string, User>();

  for (const u of USERS) {
    let user = await userRepo.findOne({ where: { email: u.email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      user = await userRepo.save({
        email: u.email,
        fullName: u.fullName,
        password: hashedPassword,
        role: u.role,
        isActive: true,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(60),
      } as any);
      console.log(`   ✅ Đã tạo: ${u.fullName} (${u.email})`);
    } else {
      console.log(`   ⏩ Đã tồn tại: ${u.fullName}`);
    }
    userMap.set(u.email, user!);
  }

  // ════════════════════
  // 2. ADDRESSES
  // ════════════════════
  console.log('\n📦 [2/7] Đang tạo địa chỉ...');

  for (const u of USERS) {
    const user = userMap.get(u.email)!;
    const existingCount = await addressRepo.count({ where: { userId: user.id } });
    if (existingCount > 0) {
      console.log(`   ⏩ Địa chỉ đã tồn tại cho: ${u.fullName}`);
      continue;
    }
    for (let i = 0; i < u.addresses.length; i++) {
      const a = u.addresses[i];
      await addressRepo.save({
        userId: user.id,
        fullName: a.fullName,
        phone: a.phone,
        province: a.province,
        district: a.district,
        ward: a.ward,
        detail: a.detail,
        isDefault: a.isDefault,
      } as any);
    }
    console.log(`   ✅ Đã tạo ${u.addresses.length} địa chỉ cho: ${u.fullName}`);
  }

  // ════════════════════
  // 3. CATEGORIES
  // ════════════════════
  console.log('\n📦 [3/7] Đang tạo danh mục...');
  const categoryMap = new Map<string, Category>();

  const existingCategoryCount = await categoryRepo.count();
  if (existingCategoryCount > 0) {
    console.log('   ⏩ Danh mục đã tồn tại, cập nhật map...');
    const allCats = await categoryRepo.find({ relations: { children: true } });
    for (const cat of allCats) {
      categoryMap.set(toSlug(cat.name), cat);
    }
  } else {
    for (const catData of CATEGORIES) {
      const parentSlug = toSlug(catData.name);
      const parent = await categoryRepo.save({
        name: catData.name,
        slug: parentSlug,
        description: catData.description,
      } as any);
      categoryMap.set(parentSlug, parent);

      for (const child of catData.children) {
        const childSlug = toSlug(child.name);
        const childCat = await categoryRepo.save({
          name: child.name,
          slug: childSlug,
          description: child.description,
          parentId: parent.id,
        } as any);
        categoryMap.set(childSlug, childCat);
      }
      console.log(`   ✅ Đã tạo danh mục: ${catData.name} (${catData.children.length} dmục con)`);
    }
  }

  // ════════════════════
  // 4. PRODUCTS
  // ════════════════════
  console.log('\n📦 [4/7] Đang tạo sản phẩm...');
  const productMap = new Map<string, Product>();

  for (const p of PRODUCTS) {
    const slug = toSlug(p.name);
    let product = await productRepo.findOne({ where: { slug } });

    if (!product) {
      const cat = categoryMap.get(p.categoryKey);
      if (!cat) {
        console.log(`   ⚠️  Bỏ qua "${p.name}" — không tìm thấy danh mục "${p.categoryKey}"`);
        continue;
      }

      product = await productRepo.save({
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice ?? undefined,
        quantity: p.quantity,
        sold: p.sold,
        isActive: p.isActive,
        categoryId: cat.id,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45),
      } as any);

      // Images
      for (const img of p.images) {
        await productImageRepo.save({
          productId: product!.id,
          url: img.url,
          isThumbnail: img.isThumbnail,
          sortOrder: img.sortOrder,
        } as any);
      }

      // Variants
      for (const v of p.variants) {
        await productVariantRepo.save({
          productId: product!.id,
          name: v.name,
          value: v.value,
          price: v.price,
          quantity: v.quantity,
          isActive: true,
        } as any);
      }

      console.log(`   ✅ Đã tạo: ${p.name}`);
    } else {
      console.log(`   ⏩ Đã tồn tại: ${p.name}`);
    }
    productMap.set(slug, product!);
  }

  // ════════════════════
  // 5. ORDERS
  // ════════════════════
  console.log('\n📦 [5/7] Đang tạo đơn hàng...');

  const existingOrderCount = await orderRepo.count();
  if (existingOrderCount > 0) {
    console.log('   ⏩ Đơn hàng đã tồn tại, bỏ qua...');
  } else {
    for (const o of ORDERS) {
      const user = userMap.get(o.userKey);
      if (!user) {
        console.log(`   ⚠️  Bỏ qua đơn hàng — không tìm thấy user: ${o.userKey}`);
        continue;
      }

      const orderDate = o.hoursAgo != null ? hoursAgo(o.hoursAgo) : daysAgo(o.daysAgo);
      let paidAt: Date | undefined = undefined;
      let shippedAt: Date | undefined = undefined;
      let deliveredAt: Date | undefined = undefined;
      let cancelledAt: Date | undefined = undefined;

      switch (o.status) {
        case OrderStatus.DELIVERED:
          deliveredAt = orderDate;
          shippedAt = daysAgo(o.daysAgo + 3);
          paidAt = orderDate;
          break;
        case OrderStatus.SHIPPING:
          shippedAt = orderDate;
          paidAt = daysAgo(o.daysAgo + 1);
          break;
        case OrderStatus.CONFIRMED:
          paidAt = daysAgo(o.daysAgo + 1);
          break;
        case OrderStatus.CANCELLED:
          cancelledAt = daysAgo(o.daysAgo + 1);
          break;
        case OrderStatus.PENDING:
          break;
      }

      const totalPrice = o.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const order = await orderRepo.save({
        userId: user.id,
        status: o.status,
        totalPrice,
        shippingFee: 0,
        addressSnapshot: {
          fullName: user.fullName,
          province: 'N/A',
          district: 'N/A',
          ward: 'N/A',
          detail: 'Địa chỉ seed',
        },
        note: o.note,
        paidAt,
        shippedAt,
        deliveredAt,
        cancelledAt,
        createdAt: orderDate,
        updatedAt: orderDate,
        cancelReason: o.status === OrderStatus.CANCELLED ? o.note : undefined,
      } as any);

      for (const item of o.items) {
        await orderItemRepo.save({
          orderId: order.id,
          productId: null,
          variantId: null,
          productName: item.productName,
          productImage: null,
          variantName: item.variantValue ?? null,
          price: item.price,
          quantity: item.quantity,
        } as any);
      }

      console.log(`   ✅ Đã tạo đơn hàng: ${totalPrice.toLocaleString()}₫ (${o.status}) — ${user.fullName}`);
    }
  }

  // ════════════════════
  // 6. REVIEWS
  // ════════════════════
  console.log('\n📦 [6/7] Đang tạo đánh giá...');

  for (const r of REVIEWS) {
    const user = userMap.get(r.userKey);
    const product = productMap.get(r.productKey);
    if (!user || !product) continue;

    const existingReview = await reviewRepo.findOne({
      where: { userId: user.id, productId: product.id } as any,
    });
    if (existingReview) continue;

    await reviewRepo.save({
      userId: user.id,
      productId: product.id,
      orderId: undefined,
      rating: r.rating,
      comment: r.comment,
      createdAt: daysAgo(r.daysAgo),
      updatedAt: daysAgo(r.daysAgo),
    } as any);
    console.log(`   ✅ Đã tạo đánh giá: ${product.name} — ${r.rating}⭐ bởi ${user.fullName}`);
  }

  // ════════════════════
  // 7. CART ITEMS
  // ════════════════════
  console.log('\n📦 [7/7] Đang tạo giỏ hàng...');

  for (const ci of CART_ITEMS) {
    const user = userMap.get(ci.userKey);
    const product = productMap.get(ci.productKey);
    if (!user || !product) continue;

    let cart = await cartRepo.findOne({ where: { user: { id: user.id } } as any });
    if (!cart) {
      cart = await cartRepo.save({ user: { id: user.id } } as any);
    }

    const existingItem = await cartItemRepo.findOne({
      where: { cartId: cart!.id, productId: product.id } as any,
    });
    if (existingItem) continue;

    await cartItemRepo.save({
      cartId: cart!.id,
      productId: product.id,
      variantId: undefined,
      quantity: ci.quantity,
    } as any);
    console.log(`   ✅ Đã thêm vào giỏ: ${product.name} (x${ci.quantity}) — ${user.fullName}`);
  }

  // ════════════════════
  // DONE
  // ════════════════════
  const elapsed = ((Date.now() - START) / 1000).toFixed(1);
  console.log(`\n✅ Seed hoàn tất! (${elapsed}s)`);

  await app.close();
}

bootstrap();
