"use client";

import { api } from "@/utils/api";
import StatCard from "./components/StatCard";

export default function AdminDashboard() {
  const { data, isLoading, error } = api.admin.getStats.useQuery();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return null; // sécurité supplémentaire

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Administrateur</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Utilisateurs" value={data.users.toString()} />
        <StatCard label="Voitures" value={data.cars.toString()} />
        <StatCard label="Marques" value={data.brands.toString()} />
        <StatCard label="Avis" value={data.reviews.toString()} />
      </div>
    </div>
  );
}
