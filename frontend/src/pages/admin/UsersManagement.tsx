/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users, Search, Filter, Shield,
  Trash2, AlertCircle, UserCheck,
  UserX, Crown, ChevronUp, ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../../components/layout/Layout';
import {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from '../../redux/api/userApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { useDebounce, useSort, useToast } from '../../hooks';

// ── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function UsersManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const role = searchParams.get('role') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  const [searchInput, setSearchInput] = useState(search);
  const [roleFilter, setRoleFilter] = useState(role);

  // ── Custom Hooks ─────────────────────────────────────────────────────────
  const { handleSort, getSortDirection} = useSort('-createdAt');
  const debouncedSearch = useDebounce(searchInput, 500);
  const { success: toastSuccess, error: toastError } = useToast();

  const { data, isLoading, error } = useGetUsersQuery({
    page, limit: 10, search: debouncedSearch, role, sort
  });
  const { data: statsData } = useGetUserStatsQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const stats = statsData?.data;

  // Sort icon helper
  const SortIcon = ({ field }: { field: string }) => {
    const dir = getSortDirection(field);
    if (dir === 'desc') return <ChevronDown className="w-3.5 h-3.5 text-primary-500" />;
    if (dir === 'asc')  return <ChevronUp   className="w-3.5 h-3.5 text-primary-500" />;
    return <ChevronDown className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600" />;
  };

  // Handle search
  const handleSearch = () => {
    const params: Record<string, string> = { page: '1' };
    if (searchInput) params.search = searchInput;
    if (roleFilter) params.role = roleFilter;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const handleClear = () => {
    setSearchInput(''); setRoleFilter('');
    setSearchParams({ sort: '-createdAt' });
  };

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    if (!window.confirm(`Change ${userName}'s role to ${newRole}?`)) return;
    try {
      await updateRole({ id: userId, role: newRole }).unwrap();
      toastSuccess(`${userName}'s role updated to ${newRole}`);
    } catch (error: any) {
      toastError(error.data?.message || 'Failed to update role');
    }
  };

  // Handle delete
  const handleDelete = async (userId: string, userName: string) => {
    if (!window.confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      await deleteUser(userId).unwrap();
      toastSuccess(`User "${userName}" deleted successfully`);
    } catch (error: any) {
      toastError(error.data?.message || 'Failed to delete user');
    }
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage all registered users and their roles
          </p>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Users',
              value: stats?.totalUsers ?? '—',
              icon: Users,
              bg: 'bg-blue-100 dark:bg-blue-900/40',
              color: 'text-blue-600 dark:text-blue-400',
            },
            {
              label: 'Admins',
              value: stats?.adminCount ?? '—',
              icon: Crown,
              bg: 'bg-purple-100 dark:bg-purple-900/40',
              color: 'text-purple-600 dark:text-purple-400',
            },
            {
              label: 'Regular Users',
              value: stats?.userCount ?? '—',
              icon: UserCheck,
              bg: 'bg-green-100 dark:bg-green-900/40',
              color: 'text-green-600 dark:text-green-400',
            },
            {
              label: 'New This Month',
              value: stats?.newThisMonth ?? '—',
              icon: UserX,
              bg: 'bg-orange-100 dark:bg-orange-900/40',
              color: 'text-orange-600 dark:text-orange-400',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label}
                className="card dark:bg-slate-800 dark:border dark:border-slate-700">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
                  {card.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-400">{card.label}</div>
              </div>
            );
          })}
        </div>

        {/* ── Filters ── */}
        <div className="card dark:bg-slate-800 dark:border dark:border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Filters & Search</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSearch} className="btn btn-primary flex items-center gap-2">
              <Search className="w-4 h-4" /><span>Search</span>
            </button>
            <button onClick={handleClear}
              className="btn btn-secondary dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
              Clear
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="card bg-red-50 dark:bg-red-900/20
                          border border-red-200 dark:border-red-800 mb-6">
            <div className="flex items-center gap-3 text-red-800 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p>Failed to load users. Please try again.</p>
            </div>
          </div>
        )}

        {/* ── Desktop Table ── */}
        <div className="hidden lg:block card dark:bg-slate-800 dark:border dark:border-slate-700 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50
                               border-b border-gray-200 dark:border-slate-700">
                <tr>
                  {[
                    { label: 'User', field: 'name' },
                    { label: 'Email', field: 'email' },
                    { label: 'Role', field: 'role' },
                    { label: 'Joined', field: 'createdAt' },
                    { label: 'Actions', field: null },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className="px-6 py-4 text-left text-xs font-semibold
                                 text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      {col.field ? (
                        <button
                          onClick={() => handleSort(col.field!)}
                          className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          {col.label}
                          {getSortIcon(col.field)}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  : data?.data.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      {/* Avatar + Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700
                                          rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                              {user.name}
                              {user._id === currentUser?._id && (
                                <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-slate-400">{user.email}</p>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
                        }`}>
                          <Shield className="w-3 h-3" />
                          <span className="capitalize">{user.role}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        {user._id !== currentUser?._id ? (
                          <div className="flex items-center gap-2">
                            {/* Role Toggle */}
                            <button
                              onClick={() => handleRoleChange(
                                user._id,
                                user.role === 'admin' ? 'user' : 'admin',
                                user.name
                              )}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                user.role === 'admin'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-900/60'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:hover:bg-purple-900/60'
                              }`}
                            >
                              <Crown className="w-3 h-3" />
                              <span>Make {user.role === 'admin' ? 'User' : 'Admin'}</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                                         rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-slate-500 italic">
                            Current user
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!isLoading && data?.data.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-slate-400">No users found</p>
            </div>
          )}
        </div>

        {/* ── Mobile Cards ── */}
        <div className="lg:hidden space-y-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card dark:bg-slate-800 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mb-3" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
              </div>
            ))
            : data?.data.map((user) => (
              <div key={user._id}
                className="card dark:bg-slate-800 dark:border dark:border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700
                                    rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {user.name}
                        {user._id === currentUser?._id && (
                          <span className="ml-1 text-xs text-primary-600">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </div>

                <div className="text-xs text-gray-500 dark:text-slate-400 mb-3">
                  Joined: {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                </div>

                {user._id !== currentUser?._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRoleChange(
                        user._id,
                        user.role === 'admin' ? 'user' : 'admin',
                        user.name
                      )}
                      className="flex-1 flex items-center justify-center gap-1.5
                                 py-2 rounded-lg text-xs font-medium
                                 bg-gray-100 dark:bg-slate-700
                                 text-gray-700 dark:text-slate-300
                                 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Make {user.role === 'admin' ? 'User' : 'Admin'}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="p-2 btn btn-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* ── Pagination ── */}
        {data && data.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => setSearchParams({
                ...Object.fromEntries(searchParams), page: String(page - 1)
              })}
              disabled={page === 1}
              className="btn btn-secondary dark:bg-slate-700 dark:text-white disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setSearchParams({
                  ...Object.fromEntries(searchParams), page: String(p)
                })}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  p === page
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setSearchParams({
                ...Object.fromEntries(searchParams), page: String(page + 1)
              })}
              disabled={page === data.pages}
              className="btn btn-secondary dark:bg-slate-700 dark:text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default UsersManagement;