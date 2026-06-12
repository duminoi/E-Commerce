import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../../api/product.api';
import { cartApi } from '../../api/cart.api';
import type { Product } from '../../types/product.type';
import { formatCurrency } from '../../utils/formatCurrency';
import { showToast } from '../../components/ui/Toast';
import { ProductCard } from '../../components/product/ProductCard';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    productApi.getBySlug(slug)
      .then(({ data }) => {
        setProduct(data.data);
        setSelectedImage(0);
        return data.data;
      })
      .then(p => {
        if (p) productApi.getRelated(p.id).then(({ data }) => setRelated(data.data || [])).catch(() => {});
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <main className="max-w-content_width mx-auto px-gutter pt-[104px] pb-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-surface-container rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl lg:gap-3xl">
            <div className="lg:col-span-7 flex gap-md">
              <div className="flex flex-col gap-sm md:w-20">
                {[1, 2, 3].map(i => <div key={i} className="w-20 h-20 bg-surface-container rounded-lg" />)}
              </div>
              <div className="flex-grow aspect-square bg-surface-container rounded-xl" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 bg-surface-container rounded w-1/4" />
              <div className="h-10 bg-surface-container rounded w-3/4" />
              <div className="h-6 bg-surface-container rounded w-1/2" />
              <div className="h-12 bg-surface-container rounded w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-content_width mx-auto px-gutter pt-[104px] pb-3xl text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">error_outline</span>
        <h2 className="font-h2 text-h2 text-on-surface mb-2">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="text-primary hover:underline font-body-md">Quay lại cửa hàng</Link>
      </main>
    );
  }

  const images = product.images?.sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const inStock = product.quantity > 0;

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showToast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    try {
      await cartApi.addItem({
        productId: product.id,
        variantId: selectedVariant || undefined,
        quantity,
      });
      showToast.success('Đã thêm vào giỏ hàng');
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Thêm vào giỏ hàng thất bại');
    }
  };

  return (
    <main className="max-w-content_width mx-auto px-gutter pt-[104px] pb-3xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant mb-lg opacity-70">
        <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
        <span>/</span>
        <Link className="hover:text-primary transition-colors" to="/products">Sản phẩm</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link className="hover:text-primary transition-colors" to={`/products?category=${product.category.slug}`}>
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-on-surface font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl lg:gap-3xl">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-md">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-sm overflow-x-auto hide-scroll md:w-20 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden shrink-0 transition-opacity ${
                    selectedImage === idx
                      ? 'border-primary'
                      : 'border-outline-variant opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-grow bg-surface rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] relative group cursor-zoom-in">
            <img
              src={images[selectedImage]?.url || '/placeholder.png'}
              alt={product.name}
              className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button className="absolute top-4 right-4 p-2 bg-surface/80 backdrop-blur-md rounded-full text-on-surface hover:text-primary transition-colors shadow-sm">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-5 flex flex-col gap-lg">
          {/* Title & Rating */}
          <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
                {discount > 0 ? 'Giảm giá' : 'Sản phẩm'}
              </span>
              <div className="flex items-center gap-1 text-secondary-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: star <= 4 ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </span>
                ))}
                <span className="font-caption text-caption text-on-surface-variant ml-2">({product.sold || 0} đã bán)</span>
              </div>
            </div>
            <h1 className="font-h1 text-h1 font-bold text-on-surface tracking-tight">{product.name}</h1>
            {product.category && (
              <p className="font-body-lg text-body-lg text-on-surface-variant">{product.category.name}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-md border-b border-outline-variant/30 pb-lg">
            <span className="font-h2 text-h2 font-semibold text-on-surface">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="font-body-lg text-body-lg text-on-surface-variant line-through mb-1">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-error/10 text-error font-label-md text-label-md px-2 py-1 rounded mb-1">
                Tiết kiệm {formatCurrency(product.comparePrice! - product.price)}
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <span className="font-label-md text-label-md text-on-surface block mb-2">
                {product.variants[0].name}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.filter(v => v.isActive).map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`px-4 py-2.5 rounded-lg font-caption transition-all ${
                      selectedVariant === v.id
                        ? 'border-2 border-primary bg-primary/5 text-primary font-medium'
                        : 'border border-outline-variant/50 bg-surface-container-lowest text-on-surface hover:border-primary'
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status & Delivery */}
          <div className="bg-surface-container-low rounded-lg p-md flex flex-col gap-sm">
            <div className={`flex items-center gap-2 font-medium ${inStock ? 'text-tertiary-container' : 'text-error'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {inStock ? 'check_circle' : 'cancel'}
              </span>
              {inStock ? `Còn hàng (${product.quantity})` : 'Hết hàng'}
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption">
              <span className="material-symbols-outlined">local_shipping</span>
              Miễn phí vận chuyển cho đơn hàng trên 500.000đ
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-4">
              <span className="font-label-md text-label-md text-on-surface">Số lượng:</span>
              <div className="flex items-center border border-outline-variant/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <span className="px-4 py-2 font-body-md text-on-surface min-w-[48px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-xl hover:bg-blue-700 transition-colors active:scale-[0.98] shadow-[0px_12px_32px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              Thêm vào giỏ hàng
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-surface text-on-surface border border-outline-variant font-label-md text-label-md py-4 rounded-xl hover:bg-surface-container-low transition-colors active:scale-[0.98] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-between py-md border-t border-outline-variant/30">
            <div className="flex flex-col items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined">verified_user</span>
              <span className="font-caption text-caption text-xs">Hàng chính hãng</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined">sync</span>
              <span className="font-caption text-caption text-xs">Đổi trả 7 ngày</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined">lock</span>
              <span className="font-caption text-caption text-xs">Thanh toán an toàn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-3xl pt-xl border-t border-outline-variant/30">
        <div className="flex gap-xl border-b border-outline-variant/30 mb-lg">
          <button className="font-label-md text-label-md text-primary border-b-2 border-primary pb-sm transition-colors">
            Mô tả
          </button>
          <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary pb-sm transition-colors">
            Đánh giá
          </button>
        </div>
        <div className="max-w-3xl font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
          {product.description}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-3xl">
          <h2 className="font-h2 text-h2 font-semibold text-on-surface mb-lg">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-lg">
            {related.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}