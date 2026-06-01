import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productApi } from '../../api/product.api';
import { cartApi } from '../../api/cart.api';
import type { Product } from '../../types/product.type';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../../components/ui/Button';
import { showToast } from '../../components/ui/Toast';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

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

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  const images = product.images?.sort((a, b) => a.sortOrder - b.sortOrder) || [];
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showToast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }
    try {
      await cartApi.addItem({ productId: product.id, variantId: selectedVariant || undefined, quantity: 1 });
      showToast.success('Đã thêm vào giỏ hàng');
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Thêm vào giỏ hàng thất bại');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src={images[selectedImage]?.url || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button key={img.id} onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded border-2 flex-shrink-0 overflow-hidden ${selectedImage === idx ? 'border-blue-600' : 'border-gray-200'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">Đã bán {product.sold}</p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-red-600">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through">{formatCurrency(product.comparePrice)}</span>
            )}
            {discount > 0 && <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded">-{discount}%</span>}
          </div>

          <p className="text-gray-600 mb-6 whitespace-pre-line">{product.description}</p>

          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">{product.variants[0].name}</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                      selectedVariant === v.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-600'
                    }`}>
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button size="lg" className="w-full" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => (
              <a key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100">
                  <img src={p.images?.[0]?.url || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{p.name}</h3>
                  <span className="text-sm font-bold text-blue-600">{formatCurrency(p.price)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
