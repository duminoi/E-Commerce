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

  if (isLoading) return <div className="text-center py-16 text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-medium">Danh mục</th>
              <th className="text-right px-4 py-3 font-medium">Giá</th>
              <th className="text-right px-4 py-3 font-medium">Tồn kho</th>
              <th className="text-right px-4 py-3 font-medium">Đã bán</th>
              <th className="text-center px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]?.url || '/placeholder.png'} alt={p.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
                    <span className="font-medium line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.price)}</td>
                <td className="px-4 py-3 text-right">{p.quantity}</td>
                <td className="px-4 py-3 text-right">{p.sold}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline text-xs">Xóa</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Chưa có sản phẩm</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
