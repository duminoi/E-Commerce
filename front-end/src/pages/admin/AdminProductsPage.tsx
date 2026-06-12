import { useState, useEffect } from 'react';
import { productApi } from '../../api/product.api';
import { formatCurrency } from '../../utils/formatCurrency';

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productApi.getAll({ limit: 100 })
      .then(({ data }) => setProducts(data.data?.items || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await productApi.remove(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch { /* ignore */ }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface-container rounded w-1/4" />
        <div className="h-96 bg-surface-container rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="font-h2 text-h2 text-on-surface">Quản lý sản phẩm</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-[20px] shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="text-right px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Giá
                </th>
                <th className="text-right px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="text-right px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Đã bán
                </th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.images?.[0]?.url || '/placeholder.png'}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover bg-surface-container-low"
                      />
                      <span className="font-body-md text-body-md text-on-surface font-medium line-clamp-1">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-caption text-on-surface-variant">{p.category?.name}</td>
                  <td className="px-6 py-4 text-right font-body-md font-medium text-on-surface">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-6 py-4 text-right font-body-md text-on-surface">{p.quantity}</td>
                  <td className="px-6 py-4 text-right font-body-md text-on-surface">{p.sold}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">inventory_2</span>
                    <p className="text-on-surface-variant">Chưa có sản phẩm</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}