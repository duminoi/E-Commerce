import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategoryService } from '../modules/category/category.service';
import { ProductService } from '../modules/product/product.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const categoryService = app.get(CategoryService);
  const productService = app.get(ProductService);

  // Create categories
  const categories: { name: string; description: string; children?: { name: string; description: string }[] }[] = [
    {
      name: 'Điện thoại',
      description: 'Điện thoại thông minh chính hãng',
      children: [
        { name: 'iPhone', description: 'Apple iPhone' },
        { name: 'Samsung', description: 'Samsung Galaxy' },
        { name: 'Xiaomi', description: 'Xiaomi Redmi' },
      ],
    },
    {
      name: 'Laptop',
      description: 'Laptop văn phòng và gaming',
      children: [
        { name: 'MacBook', description: 'Apple MacBook' },
        { name: 'Dell', description: 'Dell Inspiron, XPS' },
        { name: 'ASUS', description: 'ASUS ZenBook, TUF' },
      ],
    },
    {
      name: 'Phụ kiện',
      description: 'Phụ kiện công nghệ',
      children: [
        { name: 'Tai nghe', description: 'Tai nghe có dây, không dây' },
        { name: 'Sạc dự phòng', description: 'Pin sạc dự phòng' },
        { name: 'Ốp lưng', description: 'Ốp lưng điện thoại' },
      ],
    },
  ];

  for (const catData of categories) {
    let parent = await categoryService.findBySlug(catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).catch(() => null);
    if (!parent) {
      parent = await categoryService.create({ name: catData.name, description: catData.description });
      console.log(`  Created category: ${parent.name}`);
    } else {
      console.log(`  Category exists: ${parent.name}`);
    }

    for (const child of catData.children || []) {
      const slug = child.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let childCat = await categoryService.findBySlug(slug).catch(() => null);
      if (!childCat) {
        childCat = await categoryService.create({ name: child.name, description: child.description, parentId: parent.id });
        console.log(`    Created subcategory: ${childCat.name}`);
      }
    }
  }

  // Wait for categories to be available
  const allCats = await categoryService.findAll();
  const getCatBySlug = (slug: string) => allCats.find(c => c.slug === slug);

  // Create products
  const products = [
    { name: 'iPhone 16 Pro Max 256GB', description: 'Apple A18 Pro, 8GB RAM, 256GB, 48MP Camera', price: 33990000, comparePrice: 35990000, quantity: 50, categorySlug: 'iphone' },
    { name: 'iPhone 16 Pro 128GB', description: 'Apple A18 Pro, 8GB RAM, 128GB', price: 27990000, comparePrice: 29990000, quantity: 40, categorySlug: 'iphone' },
    { name: 'iPhone 15 128GB', description: 'Apple A16, 6GB RAM, 128GB', price: 17990000, comparePrice: 19990000, quantity: 60, categorySlug: 'iphone' },
    { name: 'Samsung Galaxy S25 Ultra', description: 'Snapdragon 8 Elite, 12GB RAM, 256GB, S Pen', price: 28990000, comparePrice: 30990000, quantity: 30, categorySlug: 'samsung' },
    { name: 'Samsung Galaxy S24', description: 'Exynos 2400, 8GB RAM, 128GB', price: 15990000, comparePrice: 17990000, quantity: 45, categorySlug: 'samsung' },
    { name: 'Xiaomi Redmi Note 14 Pro', description: 'MediaTek Dimensity 7200, 8GB RAM, 256GB', price: 8990000, quantity: 70, categorySlug: 'xiaomi' },
    { name: 'Xiaomi 14T', description: 'MediaTek Dimensity 8300, 12GB RAM, 512GB, Leica Camera', price: 12990000, comparePrice: 14990000, quantity: 25, categorySlug: 'xiaomi' },
    { name: 'MacBook Pro 14 M4 Pro', description: 'Apple M4 Pro, 18GB RAM, 512GB SSD', price: 45990000, comparePrice: 48990000, quantity: 20, categorySlug: 'macbook' },
    { name: 'MacBook Air M3', description: 'Apple M3, 8GB RAM, 256GB SSD', price: 24990000, comparePrice: 26990000, quantity: 35, categorySlug: 'macbook' },
    { name: 'Dell XPS 15', description: 'Intel Core Ultra 9, 32GB RAM, 1TB SSD, OLED', price: 39990000, quantity: 15, categorySlug: 'dell' },
    { name: 'Dell Inspiron 16', description: 'Intel Core i7-1360P, 16GB RAM, 512GB SSD', price: 19990000, quantity: 25, categorySlug: 'dell' },
    { name: 'ASUS ZenBook 14', description: 'Intel Core Ultra 7, 16GB RAM, 512GB SSD, OLED', price: 22990000, quantity: 20, categorySlug: 'asus' },
    { name: 'ASUS TUF Gaming F15', description: 'Intel Core i7-12700H, RTX 4060, 16GB RAM', price: 25990000, quantity: 18, categorySlug: 'asus' },
    { name: 'Tai nghe AirPods Pro 2 USB-C', description: 'Chống ồn chủ động, Spatial Audio', price: 5990000, comparePrice: 6490000, quantity: 100, categorySlug: 'tai-nghe' },
    { name: 'Tai nghe Samsung Galaxy Buds 3 Pro', description: 'Chống ồn thông minh, 360 Audio', price: 4290000, comparePrice: 4790000, quantity: 80, categorySlug: 'tai-nghe' },
    { name: 'Sạc dự phòng Anker PowerCore 20000mAh', description: 'Dung lượng 20000mAh, PD 20W', price: 890000, quantity: 150, categorySlug: 's-c-d-ph-ng' },
    { name: 'Sạc dự phòng Xiaomi 10000mAh', description: 'Mỏng nhẹ, PD 20W', price: 450000, quantity: 200, categorySlug: 's-c-d-ph-ng' },
    { name: 'Ốp lưng Silicon iPhone 15 Pro Max', description: 'Chất liệu silicon mềm mại, chống sốc', price: 199000, quantity: 500, categorySlug: 'p-l-ng' },
    { name: 'Ốp lưng trong suốt Samsung S25 Ultra', description: 'TPU siêu trong, chống ố vàng', price: 149000, quantity: 400, categorySlug: 'p-l-ng' },
  ];

  for (const pData of products) {
    const cat = getCatBySlug(pData.categorySlug);
    if (!cat) {
      console.log(`  WARNING: Category '${pData.categorySlug}' not found`);
      continue;
    }
    const slug = pData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existingProduct = await productService.findBySlug(slug).catch(() => null);
    if (!existingProduct) {
      await productService.create({
        name: pData.name,
        description: pData.description,
        price: pData.price,
        comparePrice: pData.comparePrice || undefined,
        quantity: pData.quantity,
        categoryId: cat.id,
      });
      console.log(`  Created product: ${pData.name}`);
    } else {
      console.log(`  Product exists: ${pData.name}`);
    }
  }

  console.log('\n✅ Seed completed!');
  await app.close();
}

bootstrap();
