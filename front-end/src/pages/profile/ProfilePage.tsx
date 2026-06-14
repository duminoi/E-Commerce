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
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: '', phone: '', province: '', district: '', ward: '', detail: '' });

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setAvatar(user.avatar || '');
    }
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
      await userApi.updateProfile({ fullName, avatar: avatar || undefined });
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

  const initials = (user?.fullName || user?.email || '?').charAt(0).toUpperCase();

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
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <p className="font-body-md font-medium text-on-surface">{user?.fullName || 'Người dùng'}</p>
                <p className="text-caption text-on-surface-variant">{user?.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              <a href="#profile" className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-caption">
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
          <div id="profile" className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">person</span>
              <h2 className="text-[14px] font-medium text-on-surface">Thông tin cá nhân</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="w-full space-y-6">
              {/* Avatar */}
              <div>
                <label className="font-label-md text-on-surface block mb-2 whitespace-nowrap">Ảnh đại diện</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold overflow-hidden flex-shrink-0">
                    {avatar ? (
                      <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Dán URL ảnh đại diện..."
                    className="flex-1 min-w-0 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="font-label-md text-on-surface block mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl pl-12 pr-4 py-3 text-[16px] text-on-surface/70 cursor-not-allowed"
                  />
                </div>
                <p className="text-[13px] text-on-surface-variant/60 mt-1.5">Email không thể thay đổi</p>
              </div>

              {/* Full name */}
              <div>
                <label className="font-label-md text-on-surface block mb-2">Họ tên</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-on-surface-variant pointer-events-none">
                    badge
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    minLength={2}
                    placeholder="Nhập họ và tên..."
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors active:scale-[0.98] inline-flex items-center gap-2 disabled:opacity-50 whitespace-nowrap text-[14px] font-medium"
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
                <h2 className="text-[14px] font-medium text-on-surface">Địa chỉ giao hàng</h2>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-1 text-primary font-caption hover:underline whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Thêm địa chỉ
                </button>
              )}
            </div>

            {showForm && (
              <form onSubmit={handleAddressSubmit} className="mb-lg p-lg bg-surface-container-low rounded-xl space-y-4">
                <h3 className="text-[14px] font-medium text-on-surface">
                  {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] font-medium text-on-surface block mb-2">Họ tên người nhận</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-medium text-on-surface block mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      placeholder="0912345678"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[14px] font-medium text-on-surface block mb-2">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    required
                    placeholder="Hà Nội"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[14px] font-medium text-on-surface block mb-2">Quận/Huyện</label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      required
                      placeholder="Cầu Giấy"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-medium text-on-surface block mb-2">Phường/Xã</label>
                    <input
                      type="text"
                      value={form.ward}
                      onChange={(e) => setForm({ ...form, ward: e.target.value })}
                      required
                      placeholder="Dịch Vọng"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[14px] font-medium text-on-surface block mb-2">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={form.detail}
                    onChange={(e) => setForm({ ...form, detail: e.target.value })}
                    required
                    placeholder="Số nhà, tên đường..."
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-primary text-white py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2 whitespace-nowrap text-[14px] font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    {editingId ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border border-outline-variant text-on-surface py-2.5 px-6 rounded-xl hover:bg-surface-container-low transition-colors text-[14px] font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {addresses.length === 0 && !showForm ? (
              <div className="text-center py-xl">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-3 block">location_off</span>
                <p className="text-on-surface-variant font-body-md">Chưa có địa chỉ nào</p>
                <p className="text-caption text-on-surface-variant/60 mt-1">Nhấn "Thêm địa chỉ" để bắt đầu</p>
              </div>
            ) : !showForm ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      addr.isDefault ? 'border-primary/30 bg-primary/5' : 'border-outline-variant/20 hover:border-outline-variant/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-on-surface">{addr.fullName}</p>
                          <span className="text-on-surface-variant">|</span>
                          <span className="text-on-surface-variant">{addr.phone}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-caption text-on-surface-variant mt-1.5">
                          {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-4 flex-shrink-0">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(addr.id)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="Đặt làm mặc định"
                          >
                            <span className="material-symbols-outlined text-[18px]">star_outline</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(addr)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
