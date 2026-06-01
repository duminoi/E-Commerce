import { Link } from 'react-router-dom';
import type { Product } from '../../types/product.type';
import { formatCurrency } from '../../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.images?.find(img => img.isThumbnail)?.url || product.images?.[0]?.url || '/placeholder.png';
  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <Link to={`/products/${product.slug}`} className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        <img src={thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-{discount}%</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm text-gray-600 mb-1 line-clamp-1">{product.category?.name}</h3>
        <h2 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h2>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600">{formatCurrency(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.comparePrice)}</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">Đã bán {product.sold}</p>
      </div>
    </Link>
  );
}
