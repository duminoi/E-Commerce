import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { userApi } from '../../api/user.api';
import { orderApi } from '../../api/order.api';
import { Button } from '../../components/ui/Button';
import { showToast } from '../../components/ui/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../utils/constants';

export function CheckoutPage() {
  const { items, total, fetchCart } = useCartStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    userApi.getAddresses().then(({ data }) => {
      const addrs = data.data || [];
      setAddresses(addrs);
      const defaultAddr = addrs.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
    }).catch(() => {});
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }
    setIsLoading(true);
    try {
      await orderApi.create({ addressId: selectedAddressId, note: note || undefined });
      showToast.success('Đặt hàng thành công!');
      navigate(ROUTES.ORDERS);
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-600 mb-4">Giỏ hàng trống</p>
        <Button onClick={() => navigate(ROUTES.PRODUCTS)}>Mua sắm</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">Địa chỉ giao hàng</h2>
            {addresses.length === 0 ? (
              <p className="text-gray-500">Chưa có địa chỉ. Vui lòng thêm địa chỉ trong trang cá nhân.</p>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr: any) => (
                  <label key={addr.id} className={`block p-3 border rounded-lg cursor-pointer ${selectedAddressId === addr.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)} className="mr-2" />
                    <span className="font-medium">{addr.fullName}</span> - {addr.phone}<br />
                    <span className="text-sm text-gray-500">{addr.detail}, {addr.ward}, {addr.district}, {addr.province}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold mb-4">Ghi chú</h2>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none"
              placeholder="Ghi chú cho đơn hàng..." />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h2 className="font-semibold mb-4">Đơn hàng</h2>
          <div className="space-y-2 mb-4">
            {items.map((item: any) => {
              const price = item.variant?.price ?? item.product?.price ?? 0;
              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="flex-1 truncate">{item.product?.name} x{item.quantity}</span>
                  <span className="ml-2">{formatCurrency(price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Tổng</span>
            <span className="text-blue-600">{formatCurrency(total)}</span>
          </div>
          <Button className="w-full mt-4" size="lg" isLoading={isLoading} onClick={handlePlaceOrder}>
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
}
