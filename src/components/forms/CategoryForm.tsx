// components/forms/CategoryForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { trpc } from "@/lib/trpc"; // Assuming your client-side tRPC import
import { toast } from "sonner"; // For notifications

import {
  Input,
  Label,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui'; // Adjust imports based on your actual UI components
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import { Checkbox } from "@radix-ui/react-checkbox"; // Assuming you use this Checkbox

// Define the shape of your category data for the form
interface CategoryFormData {
  id?: string; // Optional for new categories
  name: string;
  slug: string;
  description: string | null;
  image: string | File | null; // Allow string (URL) or File
  visible: boolean;
}

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    visible: boolean;
  };
}

// Helper to generate slug (copy from articles form or a utils file)
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const isNewCategory = !initialData?.id;

  const [formData, setFormData] = useState<CategoryFormData>(() => {
    if (initialData) {
      return {
        id: initialData.id,
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description,
        image: initialData.image,
        visible: initialData.visible,
      };
    }
    return {
      name: "",
      slug: "",
      description: null,
      image: null,
      visible: true,
    };
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  // tRPC Mutations
  const createCategoryMutation = trpc.category.create.useMutation({
    onSuccess: (newCategory) => {
      toast.success("Category created successfully!");
      router.push(`/admin/categories/${newCategory.slug}`); // Redirect to the new category's edit page
    },
    onError: (err) => {
      console.error("Error creating category:", err);
      toast.error(`Error creating category: ${err.message}`);
    },
  });

  const updateCategoryMutation = trpc.category.update.useMutation({
    onSuccess: (updatedCategory) => {
      toast.success("Category updated successfully!");
      if (updatedCategory.slug !== formData.slug) {
        router.push(`/admin/categories/${updatedCategory.slug}`); // Redirect if slug changed
      }
    },
    onError: (err) => {
      console.error("Error updating category:", err);
      toast.error(`Error updating category: ${err.message}`);
    },
  });

  // NEW: Delete mutation
  const deleteCategoryMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      router.push("/admin/categories"); // Redirect to categories list after deletion
    },
    onError: (err) => {
      console.error("Error deleting category:", err);
      toast.error(`Error deleting category: ${err.message}`);
    },
  });

  // Effect for dynamic slug generation from 'name'
  useEffect(() => {
    if (isNewCategory && formData.name) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }));
    } else if (!isNewCategory && initialData && formData.name !== initialData.name) {
      // If editing and name changes, update slug unless it's manually edited
      // You might want more sophisticated logic here, e.g., a separate field for slug
      // For now, if name changes in edit mode, it also regenerates the slug.
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }));
    }
  }, [formData.name, isNewCategory, initialData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      let newValue: string | boolean | null = value;
      if (type === "checkbox") {
        newValue = (e.target as HTMLInputElement).checked;
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImageUrl: string | null = null;

    // --- File Upload Logic ---
    if (formData.image instanceof File) {
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.image);

      try {
        const uploadResponse = await fetch('/api/upload', { // Your API route
          method: 'POST',
          body: formDataToSend,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Upload response not OK:", errorText);
          throw new Error(`Upload failed: ${uploadResponse.statusText}. Details: ${errorText}`);
        }
        const uploadData = await uploadResponse.json();
        const baseUrl = window.location.origin;
        uploadedImageUrl = `${baseUrl}${uploadData.url}`;

        if (!uploadedImageUrl) {
          console.error("Upload API returned no URL!");
          toast.error("Image upload succeeded but no URL was returned.");
          return;
        }
        toast.success("Image uploaded successfully!");
      } catch (uploadError: any) {
        console.error("Image upload error:", uploadError);
        toast.error(`Failed to upload image: ${uploadError.message}`, { description: "Please try again.", duration: 5000 });
        return; // Stop submission if image upload fails
      }
    } else if (typeof formData.image === 'string') {
      uploadedImageUrl = formData.image; // If it's already a URL string (e.g., existing image)
    }
    // --- End File Upload Logic ---

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      image: uploadedImageUrl, // Ensure this is string or null
      visible: formData.visible,
    };
    console.log("Final payload for tRPC mutation:", payload);

    if (isNewCategory) {
      createCategoryMutation.mutate(payload);
    } else {
      if (!formData.id) {
        toast.error("Error: Category ID is missing for update.");
        return;
      }
      updateCategoryMutation.mutate({
        id: formData.id,
        ...payload
      });
    }
  };

  // NEW: handleDelete function for category
  const handleDelete = () => {
    if (!isNewCategory && formData.id) {
      if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
        deleteCategoryMutation.mutate({ id: formData.id });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{isNewCategory ? "Create New Category" : "Edit Category"}</CardTitle>
          <CardDescription>
            {isNewCategory ? "Add a new category to organize your articles." : "Update the details of this category."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Name */}
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>

          {/* Generated Slug */}
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              readOnly // Slugs are usually read-only once generated or set
              className="mt-1 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Category Image (Optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageFileChange}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Image Preview:</p>
                <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto rounded-md shadow-md object-cover max-h-64" />
              </div>
            )}
          </div>

          {/* Visibility Checkbox */}
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="visible"
              name="visible"
              checked={formData.visible}
              onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, visible: checked }))}
            />
            <Label htmlFor="visible">Visible to Public</Label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')}>
          Cancel
        </Button>

        {/* Delete Button (only for existing categories) */}
        {!isNewCategory && (
          <Button
            type="button" // Important: not a submit button for form
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
          >
            {deleteCategoryMutation.isPending ? "Deleting..." : "Delete Category"}
          </Button>
        )}

        <Button
          type="submit"
          disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
        >
          {isNewCategory
            ? createCategoryMutation.isPending ? "Creating..." : "Create Category"
            : updateCategoryMutation.isPending ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </form>
  );
}