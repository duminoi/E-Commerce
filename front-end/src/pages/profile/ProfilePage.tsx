import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { userApi } from '../../api/user.api';
import { showToast } from '../../components/ui/Toast';
import { ROUTES } from '../../utils/constants';

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
    <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant/70 mb-lg">
        <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
        <span>/</span>
        <span className="text-on-surface">Tài khoản</span>
      </nav>

      <h1 className="font-h1 text-h1 text-on-surface mb-lg">Tài khoản của tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <div className="flex items-center gap-3 mb-lg pb-md border-b border-outline-variant/30">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-2xl">person</span>
              </div>
              <div>
                <p className="font-body-md font-medium text-on-surface">{user?.fullName}</p>
                <p className="text-caption text-on-surface-variant">{user?.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-caption">
                <span className="material-symbols-outlined text-[18px]">person</span>
                Thông tin cá nhân
              </a>
              <Link to={ROUTES.ORDERS} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors text-caption">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                Đơn hàng của tôi
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Profile Info */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">person</span>
              <h2 className="font-label-md text-label-md text-on-surface font-semibold">Thông tin cá nhân</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="max-w-md space-y-5">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-body-md text-on-surface-variant/50 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-2">Họ tên</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant pointer-events-none">
                    badge
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary-container text-on-primary font-label-md py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors active:scale-[0.98] flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">{isSaving ? 'hourglass_empty' : 'save'}</span>
                {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </form>
          </div>

          {/* Addresses */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <div className="flex items-center justify-between mb-lg pb-md border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <h2 className="font-label-md text-label-md text-on-surface font-semibold">Địa chỉ giao hàng</h2>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1 text-primary font-caption hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm địa chỉ
                </button>
              )}
            </div>

            {showForm && (
              <form onSubmit={handleAddressSubmit} className="mb-lg p-lg bg-surface-container-low rounded-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-2">Họ tên</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-2">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-2">Quận/Huyện</label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-2">Phường/Xã</label>
                    <input
                      type="text"
                      value={form.ward}
                      onChange={(e) => setForm({ ...form, ward: e.target.value })}
                      required
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface block mb-2">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={form.detail}
                    onChange={(e) => setForm({ ...form, detail: e.target.value })}
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-primary-container text-on-primary font-label-md py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    {editingId ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border border-outline-variant text-on-surface font-label-md py-2.5 px-6 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {addresses.length === 0 ? (
              <div className="text-center py-lg">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">location_off</span>
                <p className="text-on-surface-variant">Chưa có địa chỉ nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border-2 ${
                      addr.isDefault ? 'border-primary/30 bg-primary/5' : 'border-outline-variant/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-on-surface">{addr.fullName}</p>
                          <span className="text-on-surface-variant">—</span>
                          <span className="text-on-surface-variant">{addr.phone}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-caption text-on-surface-variant mt-1">
                          {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                            title="Đặt làm mặc định"
                          >
                            <span className="material-symbols-outlined text-[18px]">star</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(addr)}
                          className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}