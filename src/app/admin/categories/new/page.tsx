// app/admin/categories/new/page.tsx
import { CategoryForm } from '@/components/forms/CategoryForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Nouvelle Catégorie',
  description: 'Ajouter une nouvelle catégorie d\'articles pour l\'administration.',
};

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Add a new category</h1>
      </div>
      <Separator className="mb-8" />
      
      {/* Utilisation du composant CategoryForm */}
      <CategoryForm />
    </div>
  );
}