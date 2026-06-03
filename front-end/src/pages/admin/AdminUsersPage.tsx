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
      .then(r => r.json())
      .then(({ data }) => setUsers(data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      showToast.success('Cập nhật quyền thành công');
      loadUsers();
    } catch {
      showToast.error('Thất bại');
    }
  };

  if (isLoading) return <div className="text-center py-16 text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Người dùng</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-center px-4 py-3 font-medium">Vai trò</th>
              <th className="text-center px-4 py-3 font-medium">Trạng thái</th>
              <th className="text-center px-4 py-3 font-medium">Ngày tạo</th>
              <th className="text-center px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                      {u.fullName?.charAt(0) || '?'}
                    </div>
                    <span className="font-medium">{u.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.isActive ? 'Hoạt động' : 'Khóa'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleRole(u.id, u.role)} className="text-blue-600 hover:underline text-xs">
                    {u.role === 'ADMIN' ? 'Hạ xuống User' : 'Nâng lên Admin'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Chưa có người dùng</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
