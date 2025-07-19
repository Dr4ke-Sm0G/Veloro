// admin/articles/[slug]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react"; // Add ChangeEvent
import { api } from "@/utils/api";
import { toast } from "sonner"; // Assuming you're using Sonner now
import {
  Input,
  Label,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';

import { ChevronLeft } from 'lucide-react'; // For the back button icon
import { format } from 'date-fns'; // For date formatting
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@radix-ui/react-checkbox";
import { trpc } from "@/lib/trpc";

// Define the form data type, allowing `File` for image upload
type ArticleFormData = {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string | File | null; // Allow string (URL), File, or null
  published: boolean;
  publishedAt: Date | null;
  categoryIds: string[];
  link: string; // Add link field for slug generation
};

// Helper function to generate slug (copy from new/page.tsx)
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function AdminArticlePage() {
  const params = useParams();
  const router = useRouter();
  const currentSlug = typeof params?.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";

  const isNewArticle = currentSlug === "new";

  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: null, // Initialize as null or empty string
    published: false,
    publishedAt: null,
    categoryIds: [],
    link: "", // Initialize link
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // tRPC queries
   const { data: articleData, isLoading: isLoadingArticle } = api.article.getById.useQuery(
    { slug: currentSlug },
    { enabled: !isNewArticle }
  );
    const { data: categoryListResponse, isLoading: isLoadingCategories } = trpc.category.list.useQuery();

      
  // tRPC mutations (ensure these match your router's input types)
  const createArticleMutation = api.article.create.useMutation({
    onSuccess: (newArticle) => {
      toast.success("Article created successfully!", { duration: 3000 });
      router.push(`/admin/articles/${newArticle.slug}`);
    },
    onError: (err) => {
      console.error("Error creating article:", err);
      toast.error(`Error creating article: ${err.message}`, { duration: 5000 });
    },
  });

  const updateArticleMutation = api.article.update.useMutation({
    onSuccess: (updatedArticle) => {
      toast.success("Article updated successfully!", { duration: 3000 });
      if (updatedArticle.slug !== currentSlug) {
        router.push(`/admin/articles/${updatedArticle.slug}`);
      }
    },
    onError: (err) => {
      console.error("Error updating article:", err);
      toast.error(`Error updating article: ${err.message}`, { duration: 5000 });
    },
  });

  const deleteArticleMutation = api.article.delete.useMutation({
    onSuccess: () => {
      toast.success("Article deleted successfully!", { duration: 3000 });
      router.push("/admin/articles");
    },
    onError: (err) => {
      console.error("Error deleting article:", err);
      toast.error(`Error deleting article: ${err.message}`, { duration: 5000 });
    },
  });

  // Populate form if editing an existing article
  useEffect(() => {
    if (articleData) {
      setFormData({
        id: articleData.id,
        title: articleData.title,
        slug: articleData.slug,
        content: articleData.content,
        excerpt: articleData.excerpt || "",
        coverImage: articleData.coverImage || null, // Ensure null if not present
        published: articleData.published,
        publishedAt: articleData.publishedAt,
        categoryIds: articleData.categories.map(cat => cat.id),
        link: articleData.title, // Populate link with title or a reasonable default
      });
      if (articleData.coverImage) {
        setImagePreview(articleData.coverImage); // Set preview for existing image
      }
    } else if (isNewArticle) {
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        coverImage: null,
        published: false,
        publishedAt: null,
        categoryIds: [],
        link: "",
      });
      setImagePreview(null);
    }
  }, [articleData, isNewArticle]);

  // Effect for dynamic slug generation from 'link'
  useEffect(() => {
    if (isNewArticle && formData.link) { // Only auto-generate for new articles
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.link) }));
    } else if (!isNewArticle && articleData && formData.link && formData.link !== articleData.title) {
      // If editing and link changes (assuming link is based on title for now)
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.link) }));
    }
  }, [formData.link, isNewArticle, articleData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      // Safely determine the new value based on input type
      let newValue: string | boolean | Date | null | File | string[] = value; // Default to value
      if (type === "checkbox") {
        // Explicitly cast e.target to HTMLInputElement to access 'checked'
        newValue = (e.target as HTMLInputElement).checked;
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  // New: Handle file input change
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, coverImage: null }));
      setImagePreview(null);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedImageUrl: string | null = null;

    // --- File Upload Logic ---
    if (formData.coverImage instanceof File) {
      const formDataToSend = new FormData();
      formDataToSend.append('file', formData.coverImage);

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
          toast.error("Image upload succeeded but no URL was returned.", { duration: 5000 });
          return;
        }
        toast.success("Image uploaded successfully!");
      } catch (uploadError: any) {
        console.error("Image upload error:", uploadError);
        toast.error(`Failed to upload image: ${uploadError.message}`, { description: "Please try again.", duration: 5000 });
        return; // Stop submission if image upload fails
      }
    } else if (typeof formData.coverImage === 'string') {
      uploadedImageUrl = formData.coverImage; // If it's already a URL string (e.g., existing image)
    }
    // --- End File Upload Logic ---

    // Prepare payload for tRPC mutation
    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt || null,
      coverImage: uploadedImageUrl, // This must be a valid URL string or null
      published: formData.published,
      publishedAt: formData.published ? (formData.publishedAt || new Date()) : null,
      categoryIds: formData.categoryIds,
    };
    console.log("Final payload for tRPC mutation:", payload); // <--- Add this log
    if (typeof payload.coverImage !== 'string' && payload.coverImage !== null) {
      console.error("coverImage in payload is not a string or null:", payload.coverImage);
      toast.error("Internal error: Image URL not correctly prepared for submission.");
      return; // Prevent mutation if type is wrong
    }

    if (isNewArticle) {
      // Cast to the expected payload type for create mutation
      await createArticleMutation.mutateAsync(payload);
    } else {
      if (!formData.id) {
        alert("Error: Article ID is missing for update.");
        return;
      }
      // Cast to the expected payload type for update mutation, including ID
      await updateArticleMutation.mutateAsync({
        id: formData.id,
        ...payload
      });
    }
  };

  const handleDelete = () => {
    if (!isNewArticle && formData.id && confirm("Are you sure you want to delete this article?")) {
      deleteArticleMutation.mutate({ id: formData.id });
    }
  };

  if (isLoadingArticle && !isNewArticle) {
    return <div className="min-h-screen flex items-center justify-center">Loading article...</div>;
  }
  if (isLoadingCategories) {
    return <div className="min-h-screen flex items-center justify-center">Loading categories...</div>;
  }

  // Helper for datetime-local input value
  const formattedPublishedAt = formData.publishedAt
    ? format(formData.publishedAt, "yyyy-MM-dd'T'HH:mm")
    : '';
  const categories = categoryListResponse?.categories || []; // Extract the array
  return (
    <div className="flex flex-col min-h-screen p-8 bg-gray-50 dark:bg-gray-950">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/admin/articles')} className="flex items-center gap-2 text-primary dark:text-gray-300 hover:text-primary/80 dark:hover:text-gray-200">
          <ChevronLeft className="h-5 w-5" />
          Back to Articles
        </Button>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
        {isNewArticle ? "Create New Article" : `Edit Article: ${articleData?.title}`}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Content Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>

              {/* Link (for slug generation) */}
              <div>
                <Label htmlFor="link">Link for Slug</Label>
                <Input
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="e.g., My Awesome Article"
                  className="mt-1"
                />
              </div>

              {/* Generated Slug (read-only) */}
              <div>
                <Label htmlFor="slug">Generated Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  readOnly
                  className="mt-1 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  className="mt-1"
                  required
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Image Upload */}
              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  id="coverImage"
                  type="file" // Changed to type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFileChange} // New handler for file input
                  className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Image Preview:</p>
                    <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto rounded-md shadow-md object-cover max-h-64" />
                  </div>
                )}
              </div>

              {/* Categories Select */}
              <div>
                <Label htmlFor="categoryIds">Category (Optional)</Label>
                {isLoadingCategories ? (
                  <p className="text-gray-500 mt-1">Loading categories...</p>
                ) : (
                  <Select
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryIds: value ? [value] : [] }))}
                    value={formData.categoryIds?.[0] || ''}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                      ) : (
                        // Now 'categories' refers to the array, so .map works
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="published"
                  name="published"
                  checked={formData.published}
                  onCheckedChange={(checked: boolean) => handleChange({
                    target: { name: 'published', type: 'checkbox', value: checked ? 'true' : 'false', checked }
                  } as ChangeEvent<HTMLInputElement>)} // Cast to match expected ChangeEvent
                />
                <Label htmlFor="published">Publish Article</Label>
              </div>

              {/* Published At (conditional render) */}
              {formData.published && (
                <div>
                  <Label htmlFor="publishedAt">Published At (Optional, defaults to now if published)</Label>
                  <Input
                    type="datetime-local"
                    id="publishedAt"
                    name="publishedAt"
                    value={formattedPublishedAt} // Use the formatted value
                    onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value ? new Date(e.target.value) : null }))}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/articles')}>
            Cancel
          </Button>
          {!isNewArticle && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteArticleMutation.isPending}
            >
              {deleteArticleMutation.isPending ? "Deleting..." : "Delete Article"}
            </Button>
          )}
          <Button
            type="submit"
            disabled={createArticleMutation.isPending || updateArticleMutation.isPending}
          >
            {isNewArticle
              ? createArticleMutation.isPending
                ? "Creating..."
                : "Create Article"
              : updateArticleMutation.isPending
                ? "Updating..."
                : "Update Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}