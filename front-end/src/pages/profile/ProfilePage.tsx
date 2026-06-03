import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { userApi } from '../../api/user.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { showToast } from '../../components/ui/Toast';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  isDefault: boolean;
}

export function ProfilePage() {
  const { user, fetchProfile } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: '', phone: '', province: '', district: '', ward: '', detail: '' });

  useEffect(() => {
    if (user) setFullName(user.fullName);
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    try {
      const { data } = await userApi.getAddresses();
      setAddresses(data.data || []);
    } catch { /* ignore */ }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userApi.updateProfile({ fullName });
      await fetchProfile();
      showToast.success('Cập nhật thông tin thành công');
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setForm({ fullName: '', phone: '', province: '', district: '', ward: '', detail: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddressSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await userApi.updateAddress(editingId, form);
        showToast.success('Cập nhật địa chỉ thành công');
      } else {
        await userApi.createAddress(form);
        showToast.success('Thêm địa chỉ thành công');
      }
      resetForm();
      await loadAddresses();
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Lưu địa chỉ thất bại');
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({ fullName: addr.fullName, phone: addr.phone, province: addr.province, district: addr.district, ward: addr.ward, detail: addr.detail });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await userApi.deleteAddress(id);
      showToast.success('Đã xóa địa chỉ');
      await loadAddresses();
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await userApi.setDefaultAddress(id);
      await loadAddresses();
      showToast.success('Đã đặt làm mặc định');
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Thất bại');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
        <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
          <Input label="Email" value={user?.email || ''} disabled />
          <Input label="Họ tên" value={fullName} onChange={e => setFullName(e.target.value)} required />
          <Button type="submit" isLoading={isSaving}>Lưu thông tin</Button>
        </form>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
          {!showForm && (
            <Button size="sm" onClick={() => setShowForm(true)}>+ Thêm địa chỉ</Button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleAddressSubmit} className="max-w-lg space-y-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Họ tên" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              <Input label="Số điện thoại" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <Input label="Tỉnh/Thành phố" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} required />
            <Input label="Quận/Huyện" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required />
            <Input label="Phường/Xã" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })} required />
            <Input label="Địa chỉ chi tiết" value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} required />
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</Button>
              <Button variant="outline" type="button" onClick={resetForm}>Hủy</Button>
            </div>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Chưa có địa chỉ nào</p>
        ) : (
          <div className="space-y-3">
            {addresses.map(addr => (
              <div key={addr.id} className={`p-4 border rounded-lg ${addr.isDefault ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{addr.fullName} - {addr.phone}</p>
                    <p className="text-sm text-gray-600">{addr.detail}, {addr.ward}, {addr.district}, {addr.province}</p>
                    {addr.isDefault && <span className="text-xs text-blue-600 font-medium">Mặc định</span>}
                  </div>
                  <div className="flex gap-2 text-sm">
                    {!addr.isDefault && (
                      <button onClick={() => handleSetDefault(addr.id)} className="text-blue-600 hover:underline">Mặc định</button>
                    )}
                    <button onClick={() => handleEdit(addr)} className="text-gray-600 hover:underline">Sửa</button>
                    <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:underline">Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
