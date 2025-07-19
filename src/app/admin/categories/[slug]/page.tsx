// app/admin/categories/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { serverClient } from "@/lib/trpc/server";
import { CategoryForm } from '@/components/forms/CategoryForm';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

interface EditCategoryPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata dynamically (optional, but good for SEO/UX)
export async function generateMetadata(props: EditCategoryPageProps): Promise<Metadata> {
  const { slug } = await props.params; // 
  try {

    // Use serverClient to fetch data for metadata
    const category = await (await serverClient()).category.getBySlug({ slug });
    return {
      title: `Modifier: ${category.name} - Admin`,
      description: `Modifier les détails de la catégorie ${category.name}.`,
    };
  } catch (error) {
    // If category not found or error, provide a generic title
    console.error(`Error generating metadata for slug ${slug}:`, error);
    return {
      title: 'Modifier Catégorie - Admin',
      description: 'Modifier une catégorie existante.',
    };
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const slug = (await params).slug;
  let categoryData;

  try {
    // Use serverClient to fetch data for the page
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

      {/* Pass the fetched category data as initialData to the form */}
      <CategoryForm initialData={categoryData} />
    </div>
  );
}