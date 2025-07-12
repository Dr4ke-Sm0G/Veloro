"use client";

import { api } from "@/utils/api";
import { useState } from "react";
import Link from "next/link";
import { Pencil, RefreshCw, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ROLES = ["USER", "DEALER", "ADMIN"] as const;
const PAGE_SIZE = 10;

type SortKey = "createdAt" | "role" | "isActive";
type SortOrder = "asc" | "desc";

export default function UserManagementPage() {
  const { data: users, isLoading, error, refetch } = api.admin.getAllUsers.useQuery();
  const updateRole = api.admin.updateUserRole.useMutation({
    onSuccess: () => { refetch(); },
  });

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleChangeRole = (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    updateRole.mutate({ userId, role: newRole as any }, {
      onSettled: () => setLoadingUserId(null),
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  if (isLoading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p className="text-red-500">Erreur : {error.message}</p>;
  if (!users) return null;

  const filteredUsers = users
    .filter((u) => !roleFilter || u.role === roleFilter)
    .filter((u) =>
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      (u.name?.toLowerCase() ?? "").includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (typeof valA === "boolean" && typeof valB === "boolean") {
        return sortOrder === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }
      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      if (valA instanceof Date && valB instanceof Date) {
        return sortOrder === "asc"
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = ROLES.map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher par nom ou email..."
            className="w-60"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Rafraîchir
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {stats.map((s) => (
          <div key={s.role} className="bg-gray-100 px-4 py-2 rounded-md text-sm font-medium">
            {s.role}: {s.count}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("role")}>
                Rôle <ArrowUpDown className="inline w-4 h-4 ml-1" />
              </th>
              <th className="px-4 py-2">Vérif.</th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("isActive")}>
                Compte <ArrowUpDown className="inline w-4 h-4 ml-1" />
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Créé le <ArrowUpDown className="inline w-4 h-4 ml-1" />
              </th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t even:bg-gray-50">
                <td className="px-4 py-2">{user.name ?? "—"}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <select
                    className="border rounded p-1"
                    value={user.role}
                    disabled={loadingUserId === user.id}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  {user.emailVerified ? "✔️" : "❌"}
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {user.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/user/${user.id}`}
                    aria-label={`Éditer ${user.name}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="sr-only">Éditer</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Précédent</Button>
          <span className="text-sm">Page {page} sur {totalPages}</span>
          <Button variant="outline" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Suivant</Button>
        </div>
      )}
    </div>
  );
}
