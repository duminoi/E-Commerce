export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  quantity: number;
  sold: number;
  isActive: boolean;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number | null;
  quantity: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  children: Category[];
}
