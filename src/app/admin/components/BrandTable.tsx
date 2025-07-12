// src/app/admin/components/BrandTable.tsx
export default function BrandTable() {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Marque</th>
          <th className="p-2">Modèles</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2">Audi</td>
          <td className="p-2">A1, A3, Q5</td>
          <td className="p-2">✏️ 🗑️</td>
        </tr>
        {/* ... */}
      </tbody>
    </table>
  );
}
