'use client';

import { api } from "@/utils/api";
import { useState } from "react";
import Link from "next/link";
import { Pencil, RefreshCw, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROLES = ["USER", "DEALER", "ADMIN"] as const;
const PAGE_SIZE = 10;

type SortKey = "createdAt" | "role" | "isActive";
type SortOrder = "asc" | "desc";

export default function UserManagementPage() {
  const { data: users, isLoading, error, refetch } = api.admin.getAllUsers.useQuery();
  const updateRole = api.admin.updateUserRole.useMutation({
    onSuccess: () => { void refetch(); },
  });

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleChangeRole = (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    updateRole.mutate({ userId, role: newRole as any }, { onSettled: () => setLoadingUserId(null) });
  };

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  if (isLoading) return <p className="text-center py-8 text-gray-700 dark:text-gray-300">Loading users...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error.message}</p>;
  if (!users) return null;

  const filtered = users
    .filter(u => !roleFilter || u.role === roleFilter)
    .filter(u =>
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      (u.name ?? "").toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return sortOrder === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (sortBy === "createdAt" && aVal && bVal) {
        const dateA = new Date(aVal as string).getTime();
        const dateB = new Date(bVal as string).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = ROLES.map(role => ({ role, count: users.filter(u => u.role === role).length }));

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 rounded-lg">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search by name or email..."
            className="flex-1 sm:w-60 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
          />
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto min-w-[120px]"
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">All roles</option>
            {ROLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="w-full sm:w-auto border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        {stats.map(s => (
          <div
            key={s.role}
            className="bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-5 py-3 rounded-lg text-sm font-semibold shadow-sm flex-grow sm:flex-grow-0 min-w-[120px] text-center"
          >
            {s.role}: <span className="font-bold">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("role")}
              >Role <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-500 dark:text-gray-400" />
              </th>
              <th className="px-6 py-3 text-center">Verified</th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("isActive")}
              >Status <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-500 dark:text-gray-400" />
              </th>
              <th className="px-6 py-3 cursor-pointer whitespace-nowrap" onClick={() => handleSort("createdAt")}
              >Created <ArrowUpDown className="inline w-4 h-4 ml-1 text-gray-500 dark:text-gray-400" />
              </th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginated.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-3 font-medium whitespace-nowrap">{user.name ?? '–'}</td>
                <td className="px-6 py-3 break-words min-w-[150px]">{user.email}</td>
                <td className="px-6 py-3">
                  <select
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm w-full"
                    value={user.role}
                    disabled={loadingUserId === user.id}
                    onChange={e => handleChangeRole(user.id, e.target.value)}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td className="px-6 py-3 text-center">{user.emailVerified ? '✅' : '❌'}</td>
                <td className="px-6 py-3">
                  <span className={cn(
                    'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                    user.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                  )}>{user.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-right">
                  <Link href={`/admin/user/${user.id}`} className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Pencil className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
          <Button variant="outline" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Previous</Button>
          <span className="text-sm whitespace-nowrap">Page {page} of {totalPages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</Button>
        </div>
      )}
    </div>
  );
}
