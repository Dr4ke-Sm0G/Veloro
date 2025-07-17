"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ColumnDef,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { api } from "@/utils/api";
import Image from "next/image";
import AdminCatalogueActions from "./AdminCatalogueActions";
import DeleteDialog from "./DeleteDialog";
import { useRouter } from "next/navigation";

interface VariantRow {
  id: string;
  brand: string;
  brandLogo?: string;
  model: string;
  name: string;
  year: number;
  bodyType?: string;
  seats?: number;
  powerHp?: number;
  rangeKm?: number;
  price?: number;
  slug: string;
  hasListings: boolean;
}

export default function CatalogueTable() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState<{ brand?: string; model?: string; year?: string }>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isPending, refetch } = api.admin.getFilteredVariants.useQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    brand: filters.brand,
    model: filters.model,
    year: filters.year,
  });

  const deleteVariant = api.admin.deleteVariant.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  const columns: ColumnDef<VariantRow>[] = [
    {
      accessorKey: "brandLogo",
      header: "",
      cell: ({ row }) =>
        row.original.brandLogo ? (
          <Image
            src={`/BrandLogos/${row.original.brandLogo}`}
            alt={row.original.brand}
            width={32}
            height={32}
            className="object-contain rounded"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-200 rounded" />
        ),
    },
    { accessorKey: "brand", header: "Marque" },
    { accessorKey: "model", header: "Modèle" },
    { accessorKey: "name", header: "Variante" },
    { accessorKey: "year", header: "Année" },
    { accessorKey: "bodyType", header: "Carrosserie" },
    { accessorKey: "seats", header: "Sièges" },
    {
      accessorKey: "powerHp",
      header: "Puissance",
      cell: ({ getValue }) => getValue() ? `${getValue()} ch` : "-",
    },
    {
      accessorKey: "rangeKm",
      header: "Autonomie",
      cell: ({ getValue }) => getValue() ? `${getValue()} km` : "-",
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: ({ getValue }) => {
        const value = getValue() as number | undefined;
        return value !== undefined && value !== null ? `${value.toLocaleString()} €` : "-";
      },
    },
    {
      accessorKey: "hasListings",
      header: "Annonce",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "default" : "secondary"}>
          {getValue() ? "En ligne" : "Aucune"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => router.push(
              `/admin/catalogue/${slugify(row.original.brand)}/${slugify(row.original.model)}/${row.original.slug}`
            )}
          >
            <Pencil className="w-4 h-4 text-blue-600" />
          </Button>
          <DeleteDialog
            title={`Supprimer la variante « ${row.original.name} » ?`}
            open={deleteId === row.original.id}
            onOpenChange={(open) => setDeleteId(open ? row.original.id : null)}
            onConfirm={() => deleteVariant.mutate({ variantId: row.original.id })}
            trigger={
              <Button size="icon" variant="ghost">
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            }
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    state: { pagination },
    pageCount: data?.totalPages ?? -1,
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <AdminCatalogueActions
        onAddVariant={(brand, model) => {
          router.push(`/admin/catalogue/${slugify(brand)}/${slugify(model)}/new`);
        }}
        onImportJSON={(file) => alert(`Importer fichier : ${file.name}`)}
        filters={filters}
        onFilterChange={(f) => setFilters(f)}
      />

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 font-medium text-gray-700">
                    {header.isPlaceholder ? null : (
                      <button
                        className="flex items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" && <ChevronUp className="w-3 h-3" />}
                        {header.column.getIsSorted() === "desc" && <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Page {pagination.pageIndex + 1} sur {data?.totalPages ?? 1}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Préc.
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suiv.
          </Button>
        </div>
      </div>
    </div>
  );
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}