import { motion } from 'framer-motion';
import type { Product } from '../../types/product.type';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-lg">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[20px] overflow-hidden border border-outline-variant/20 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] flex flex-col"
          >
            <div className="aspect-[4/5] skeleton-shimmer" />
            <div className="p-4 space-y-3 flex-1 flex flex-col">
              <div className="h-3 skeleton-shimmer rounded w-1/2" />
              <div className="h-4 skeleton-shimmer rounded w-3/4" />
              <div className="space-y-2 mt-auto">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-4 h-4 skeleton-shimmer rounded" />
                  ))}
                </div>
                <div className="h-5 skeleton-shimmer rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
        <h3 className="font-h3 text-h3 text-on-surface mb-2">Không tìm thấy sản phẩm</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-lg"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={fadeUp}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}