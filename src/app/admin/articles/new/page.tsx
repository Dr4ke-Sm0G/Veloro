'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/utils/api';
import {
    createArticleFormSchema,
    ArticleCreateMutationPayload,
    CreateArticleFormValues,
} from '@/lib/validators/article'; // Ensure these types and schemas are correct
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; // Using Sonner for toasts
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useEffect, useState, ChangeEvent } from 'react';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';

// Helper function to generate slug
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single hyphen
        .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
};

export default function NewArticlePage() {
    const router = useRouter();

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fetch categories for the dropdown
    const { data: categories, isLoading: isLoadingCategories } = api.category.list.useQuery();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        getValues, // getValues is useful if you need to manually check form state
    } = useForm<CreateArticleFormValues>({
        resolver: zodResolver(createArticleFormSchema),
        defaultValues: {
            title: '',
            link: '', // Used for slug generation
            slug: '',
            image: null, // Should be null or undefined initially as per Zod
            content: '',
            excerpt: '',
            published: false,
            publishedAt: null,
            categoryIds: [],
        },
    });

    // Watch 'link' field to automatically generate 'slug'
    const linkFieldValue = watch('link');
    useEffect(() => {
        if (linkFieldValue) {
            setValue('slug', generateSlug(linkFieldValue), { shouldValidate: true });
        } else {
            setValue('slug', '', { shouldValidate: true });
        }
    }, [linkFieldValue, setValue]);

    // Watch 'published' field for conditional rendering of 'publishedAt'
    const isPublished = watch('published');

    // Handle file input change for 'image' field
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('image', file, { shouldValidate: true }); // Set the File object to RHF
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set preview for UI
            };
            reader.readAsDataURL(file);
        } else {
            setValue('image', null, { shouldValidate: true }); // Clear image if no file selected
            setImagePreview(null); // Clear preview
        }
    };

    // tRPC mutation for creating an article
    const createArticleMutation = api.article.create.useMutation({
        onSuccess: (newArticle) => {
            toast.success("Article created successfully!", { duration: 3000 });
            router.push(`/admin/articles/${newArticle.slug}`); // Redirect to the new article's page
        },
        onError: (error) => {
            console.error("Error creating article:", error);
            toast.error(`Failed to create article: ${error.message}`, { duration: 5000 });
        },
    });

    // Main form submission handler
    const onSubmit = async (data: CreateArticleFormValues) => {
        let coverImageUrl: string | null = null;

        // Handle image upload if a new file is selected
        if (data.image instanceof File) {
            const formData = new FormData();
            formData.append('file', data.image);

            try {
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    const errorDetails = await uploadResponse.text();
                    console.error("Upload failed response:", errorDetails);
                    throw new Error(`Upload failed: ${uploadResponse.statusText}. Details: ${errorDetails}`);
                }
                const uploadData = await uploadResponse.json();
                
                // Ensure the URL exists and is a string
                if (uploadData && typeof uploadData.url === 'string' && uploadData.url.trim() !== '') {
                    coverImageUrl = uploadData.url;
                } else {
                    console.error("Upload API returned no valid URL or an empty string.");
                    toast.error("Image upload succeeded but no valid URL was returned.", { duration: 5000 });
                    return; // Stop submission if URL is invalid/missing
                }
                toast.success("Image uploaded successfully!");
            } catch (uploadError: any) {
                console.error("Image upload error:", uploadError);
                toast.error(`Failed to upload image: ${uploadError.message}`, { description: "Please try again.", duration: 5000 });
                return; // Stop submission if image upload fails
            }
        } else if (typeof data.image === 'string') {
            // This case might be less common for 'new' but handles if a default string URL was set
            coverImageUrl = data.image.trim() !== '' ? data.image : null;
        }

        // Convert publishedAt to Date object if it's a string (from datetime-local input) or set to new Date() if published
        const publishedAtForPayload = data.published
            ? (data.publishedAt ? new Date(data.publishedAt) : new Date())
            : null;

        // Construct the payload for the tRPC mutation
        const payload: ArticleCreateMutationPayload = {
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: data.excerpt || null, // Ensure excerpt is null if empty string
            coverImage: coverImageUrl, // Use the uploaded URL or null
            published: data.published,
            publishedAt: publishedAtForPayload,
            categoryIds: data.categoryIds,
        };

        console.log("Payload being sent to tRPC:", payload); // Log the final payload for debugging
        await createArticleMutation.mutateAsync(payload);
    };

    // Watch 'publishedAt' for display formatting in datetime-local input
    const publishedAtValue = watch('publishedAt');
    const formattedPublishedAt = publishedAtValue instanceof Date
        ? format(publishedAtValue, "yyyy-MM-dd'T'HH:mm")
        : (typeof publishedAtValue === 'string' ? publishedAtValue.slice(0, 16) : ''); // Handle string case from datetime-local for initial rendering

    if (isLoadingCategories) {
        return <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-300">Loading categories...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen p-8 bg-gray-50 dark:bg-gray-950">
            {/* Back Button */}
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.push('/admin/articles')} className="flex items-center gap-2 text-primary dark:text-gray-300 hover:text-primary/80 dark:hover:text-gray-200">
                    <ChevronLeft className="h-5 w-5" />
                    Back to Articles
                </Button>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Create New Article</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex-grow">
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
                                <Input id="title" {...register('title')} className="mt-1" />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Link (for slug generation) */}
                            <div>
                                <Label htmlFor="link">Link for Slug</Label>
                                <Input
                                    id="link"
                                    {...register('link')}
                                    placeholder="e.g., My Awesome Article"
                                    className="mt-1"
                                />
                                {errors.link && (
                                    <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>
                                )}
                            </div>

                            {/* Generated Slug (read-only) */}
                            <div>
                                <Label htmlFor="slug">Generated Slug</Label>
                                <Input
                                    id="slug"
                                    {...register('slug')}
                                    readOnly
                                    className="mt-1 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                                />
                                {errors.slug && (
                                    <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" {...register('content')} rows={15} className="mt-1" />
                                {errors.content && (
                                    <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                                )}
                            </div>

                            {/* Excerpt */}
                            <div>
                                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                                <Textarea id="excerpt" {...register('excerpt')} rows={4} className="mt-1" />
                                {errors.excerpt && (
                                    <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>
                                )}
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
                                <Label htmlFor="image">Cover Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageChange} // Use custom handler for file input
                                    className="mt-1 block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-50 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
                                />
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image.message as string}</p>
                                )}
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
                                        onValueChange={(value) => setValue('categoryIds', value ? [value] : [], { shouldValidate: true })}
                                        value={watch('categoryIds')?.[0] || ''}
                                    >
                                        <SelectTrigger className="w-full mt-1">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.length === 0 ? (
                                                <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                                            ) : (
                                                categories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                                {errors.categoryIds && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryIds.message}</p>
                                )}
                            </div>

                            {/* Published Checkbox */}
                            <div className="flex items-center space-x-2 mt-4">
                                <Checkbox
                                    id="published"
                                    checked={isPublished} // Control checked state via watch
                                    onCheckedChange={(checked: boolean) => setValue('published', checked, { shouldValidate: true })}
                                />
                                <Label htmlFor="published">Publish Article</Label>
                            </div>

                            {/* Published At (conditional render) */}
                            {isPublished && (
                                <div>
                                    <Label htmlFor="publishedAt">Published At (Optional, defaults to now if published)</Label>
                                    <Input
                                        id="publishedAt"
                                        type="datetime-local"
                                        // Register with setValueAs to convert string from input to Date object for RHF
                                        {...register('publishedAt', {
                                            setValueAs: (value) => value ? new Date(value) : null,
                                        })}
                                        className="mt-1"
                                        defaultValue={formattedPublishedAt} // Use the formatted string for the input's default value
                                    />
                                    {errors.publishedAt && (
                                        <p className="text-red-500 text-sm mt-1">{errors.publishedAt.message as string}</p>
                                    )}
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
                    <Button type="submit" disabled={isSubmitting || createArticleMutation.isPending}>
                        {isSubmitting || createArticleMutation.isPending ? 'Creating...' : 'Create Article'}
                    </Button>
                </div>
            </form>
        </div>
    );
}