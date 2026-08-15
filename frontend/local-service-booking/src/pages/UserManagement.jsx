import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { Search, Filter, ShieldCheck, ToggleLeft, ToggleRight, Loader2, User } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    adminService.getAllUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const nextStatus = !currentStatus;
    setLoading(true);
    adminService.toggleUserStatus(userId, nextStatus)
      .then(() => {
        fetchUsers();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update user status.');
        setLoading(false);
      });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading && users.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Search, audit, and toggle login access permissions for all platform accounts.</p>
      </div>

      {/* Filters & Search Control bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
          >
            <option value="All">All Roles</option>
            <option value="Customer">Customer</option>
            <option value="Provider">Provider</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users match search criteria"
          description="Try modifying search keywords or selected role filter options."
        />
      ) : (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm transition-colors">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] transition-colors">
                <th className="p-3.5">User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* User Profile Info */}
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0 transition-colors">
                      {u.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="block">{u.fullName}</span>
                      {u.role === 'Provider' && u.providerProfile && (
                        <span className="block text-[10px] text-teal-600 dark:text-teal-400 font-medium">{u.providerProfile.businessName}</span>
                      )}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border transition-colors ${
                      u.role === 'Admin' ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' :
                      u.role === 'Provider' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-900/30' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{u.email}</td>

                  {/* Joined Date */}
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  {/* Active Toggle Status */}
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleToggleStatus(u.userId, u.isActive)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title={u.isActive ? 'Block User' : 'Unblock User'}
                    >
                      {u.isActive ? (
                        <ToggleRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                      )}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
