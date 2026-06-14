import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatDate';
import { showToast } from '../../components/ui/Toast';

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = () => {
    fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then((r) => r.json())
      .then(({ data }) => setUsers(data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      showToast.success('Cập nhật quyền thành công');
      loadUsers();
    } catch {
      showToast.error('Thất bại');
    }
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
        <h1 className="font-h2 text-h2 text-on-surface">Quản lý người dùng</h1>
      </div>

      {/* Table card — uses .admin-table-card from Apex Commerce design system */}
      <div className="admin-table-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-lowest">
              <tr>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Email
                </th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                        <span className="font-label-md text-on-primary font-semibold">
                          {u.fullName?.charAt(0) || '?'}
                        </span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface font-medium">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-caption text-on-surface-variant">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-caption font-medium ${
                        u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {u.role === 'ADMIN' ? 'admin_panel_settings' : 'person'}
                      </span>
                      {u.role === 'ADMIN' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-caption font-medium ${
                        u.isActive ? 'bg-tertiary-container/20 text-tertiary' : 'bg-error/10 text-error'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-tertiary' : 'bg-error'}`} />
                      {u.isActive ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-caption text-on-surface-variant">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleRole(u.id, u.role)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-caption transition-colors ${
                        u.role === 'ADMIN'
                          ? 'bg-error/10 text-error hover:bg-error/20'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {u.role === 'ADMIN' ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                      {u.role === 'ADMIN' ? 'Hạ User' : 'Nâng Admin'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">group</span>
                    <p className="text-on-surface-variant">Chưa có người dùng</p>
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