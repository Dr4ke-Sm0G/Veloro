// app/admin/categories/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { serverClient } from "@/lib/trpc/server";
import { CategoryForm } from '@/components/forms/CategoryForm';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;

  try {
    const category = await (await serverClient()).category.getBySlug({ slug });
    return {
      title: `Modifier: ${category.name} - Admin`,
      description: `Modifier les détails de la catégorie ${category.name}.`,
    };
  } catch (error) {
    console.error(`Error generating metadata for slug ${slug}:`, error);
    return {
      title: 'Modifier Catégorie - Admin',
      description: 'Modifier une catégorie existante.',
    };
  }
}

export default async function EditCategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let categoryData;

  try {
    categoryData = await (await serverClient()).category.getBySlug({ slug });
  } catch (error) {
    console.error(`Failed to load category with slug ${slug}:`, error);
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Modifier la catégorie : {categoryData.name}
        </h1>
      </div>
      <Separator className="mb-8" />
      <CategoryForm initialData={categoryData} />
    </div>
  );
}
