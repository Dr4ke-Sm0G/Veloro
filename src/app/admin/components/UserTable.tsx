// src/app/admin/components/UserTable.tsx
export default function UserTable() {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Nom</th>
          <th className="p-2">Email</th>
          <th className="p-2">Rôle</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2">Alice</td>
          <td className="p-2">alice@carwow.co.uk</td>
          <td className="p-2">ADMIN</td>
          <td className="p-2">🔽 Changer rôle | ❌</td>
        </tr>
        {/* ... */}
      </tbody>
    </table>
  );
}
