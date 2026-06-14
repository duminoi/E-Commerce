import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { Product } from '../../types/product.type';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const thumbnail =
    product.images?.find((img) => img.isThumbnail)?.url ||
    product.images?.[0]?.url ||
    '/placeholder.png';

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  const isNew =
    product.createdAt &&
    Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await addItem(product.id, 1);
      toast.success('Đã thêm vào giỏ hàng');
    } catch {
      toast.error('Thêm vào giỏ hàng thất bại');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.3 } }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group product-card block bg-surface-container-lowest rounded-[20px] border border-outline-variant/25 overflow-hidden hover:shadow-[0px_16px_48px_rgba(15,23,42,0.14)] transition-shadow duration-300"
      >
        {/* Image container */}
        <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
          <img
            src={thumbnail}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-[12px] left-[12px] flex flex-col gap-[6px]">
            {isNew && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-primary text-white px-[10px] py-[4px] rounded-full text-[11px] font-semibold uppercase tracking-wide font-heading"
              >
                New
              </motion.span>
            )}
            {discount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-error text-white px-[10px] py-[4px] rounded-full text-[11px] font-semibold font-heading"
              >
                -{discount}%
              </motion.span>
            )}
          </div>

          {/* Favorite button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            whileTap={{ scale: 0.7 }}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-[12px] right-[12px] w-[36px] h-[36px] flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-all duration-200"
          >
            <motion.span
              animate={{
                scale: isFavorite ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className="material-symbols-outlined text-[18px]"
              style={{
                fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
                color: isFavorite ? '#ba1a1a' : '#434655',
              }}
            >
              favorite
            </motion.span>
          </motion.button>

          {/* Quick Add – reveals on hover */}
          <div className="reveal-btn absolute bottom-[12px] left-0 w-full px-[12px]">
            <motion.button
              onClick={handleQuickAdd}
              disabled={isAdding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-[40px] bg-white/95 backdrop-blur-sm text-on-surface rounded-[10px] border border-outline-variant/40 text-[13px] font-semibold hover:bg-primary hover:text-white hover:border-transparent transition-all duration-200 font-heading disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Đang thêm...' : 'Quick Add'}
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="p-[16px]">
          {/* Stars */}
          <div className="flex items-center gap-[3px] mb-[6px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined text-[13px]"
                style={{
                  fontVariationSettings: star <= 4 ? "'FILL' 1" : "'FILL' 0",
                  color: star <= 4 ? '#fea619' : '#c3c6d7',
                }}
              >
                star
              </span>
            ))}
            <span className="text-[12px] text-on-surface-variant ml-[4px] font-body">
              ({product.sold || 0})
            </span>
          </div>

          {/* Name */}
          <h3
            className="text-[15px] font-medium text-on-surface mb-[8px] truncate font-body"
            style={{ lineHeight: '22px' }}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-[8px]">
            <span
              className={`text-[16px] font-semibold ${discount > 0 ? 'text-error' : 'text-on-surface'} font-heading`}
            >
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && discount > 0 && (
              <span className="text-[13px] text-on-surface-variant line-through font-body">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
