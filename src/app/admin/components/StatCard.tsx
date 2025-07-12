// src/app/admin/components/StatCard.tsx

export default function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}