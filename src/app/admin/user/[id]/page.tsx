// src/app/admin/user/[id]/page.tsx

"use client";

import { api } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: user, isPending } = api.admin.getUserById.useQuery(id as string);
  const updateDetails = api.admin.updateUserDetails.useMutation();
  const updateRole = api.admin.updateUserRole.useMutation();
  const deleteUser = api.admin.deleteUserById.useMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"USER" | "DEALER" | "ADMIN">("USER");
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setRole(user.role);
      setImage(user.image ?? "");
      setActive(user.isActive ?? true);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDetails.mutateAsync({ userId: id as string, name, email, image, isActive: active });
      await updateRole.mutateAsync({ userId: id as string, role });
      toast.success("Modifications enregistrées avec succès");
      router.push("/admin/users");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync({ id: id as string });
      toast.success("Utilisateur supprimé avec succès");
      router.push("/admin/users");
    } catch (err) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  if (isPending || !user) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Modifier l&apos;utilisateur</h1>
        <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">← Retour à la liste</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select value={role} onValueChange={(val) => setRole(val as typeof role)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Utilisateur</SelectItem>
                <SelectItem value="DEALER">Concessionnaire</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image">Avatar (URL)</Label>
            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
            {image && (
              <div className="mt-2">
                <Image
                  src={image}
                  alt="Avatar Preview"
                  width={80}
                  height={80}
                  className="rounded-full border"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <Label>Statut de vérification</Label>
            <p className="mt-1 text-sm text-gray-600">
              {user.emailVerified ? `✔️ Vérifié le ${new Date(user.emailVerified).toLocaleDateString()}` : "❌ Non vérifié"}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Label htmlFor="status">Compte actif</Label>
            <Switch id="status" checked={active} onCheckedChange={setActive} />
            <span className="text-sm text-gray-500">{active ? "Actif" : "Désactivé"}</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
  <Button type="submit" className="w-full" disabled={updateDetails.isPending || updateRole.isPending}>
    Enregistrer les modifications
  </Button>

  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button type="button" variant="destructive" className="w-full">
        Supprimer
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmer la suppression</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-gray-600">Cette action est irréversible. L&apos;utilisateur sera définitivement supprimé de la base de données.</p>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
        <Button variant="destructive" onClick={handleDelete} disabled={deleteUser.isPending}>Confirmer</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
      </form>
    </div>
  );
}
