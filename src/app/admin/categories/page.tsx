// app/admin/categories/page.tsx
"use client"; // This component will fetch data using useQuery, so it must be a client component.

import Link from "next/link";
import { useState } from "react";
import { trpc } from '@/lib/trpc'; // Make sure this path is correct for your tRPC client setup.

// Import UI components (adjust paths if different in your project)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import Image from "next/image"; // For displaying category images

export default function AdminCategoriesListPage() {
  const [search, setSearch] = useState("");
  // Categories don't typically have a "published" status like articles,
  // but if you added a 'visible' field (as in your category.ts schema), you can filter by that.
  const [visibleFilter, setVisibleFilter] = useState<boolean | undefined>(undefined);


  // Use trpc.category.list.useInfiniteQuery for paginated fetching
  // This matches the return type of your `list` procedure in `category.ts`:
  // `return { categories, nextCursor };`
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } =
    trpc.category.list.useInfiniteQuery(
      {
        limit: 10, // You can adjust this limit
        search,
        visible: visibleFilter, // Use the visible filter here
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // Keep previous data when fetching new pages (e.g., on search)
        // This is useful if you want to display results as they load or if a search updates an existing list
        // You might consider removing this if you always want a fresh search result
        keepPreviousData: true,
      }
    );

  // Flatten the pages array into a single array of categories
  const categories = data?.pages.flatMap((page) => page.categories) || [];

  // Handle loading and error states for the entire page
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
        <Separator className="mb-4" />
        <div className="text-center text-gray-500">Loading categories...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
        <Separator className="mb-4" />
        <div className="text-center text-red-500">Error loading categories: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Manage Categories</h1>
        <Link href="/admin/categories/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Category
          </Button>
        </Link>
      </div>
      <Separator className="mb-8" />

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow max-w-sm"
        />
        <select
          value={visibleFilter === undefined ? "all" : visibleFilter ? "true" : "false"}
          onChange={(e) => {
            const value = e.target.value;
            setVisibleFilter(
              value === "all" ? undefined : value === "true" ? true : false
            );
          }}
          className="p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All Visibility</option>
          <option value="true">Visible</option>
          <option value="false">Hidden</option>
        </select>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="flex flex-col overflow-hidden">
              {category.image && (
                <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill // Use fill for responsiveness
                    style={{ objectFit: 'cover' }} // Correct object-fit usage with fill
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription className="text-sm">Slug: {category.slug}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {category.description || 'No description provided.'}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Visibility: {category.visible ? 'Public' : 'Hidden'}
                </div>
                <Link href={`/admin/categories/${category.slug}`} passHref>
                  <Button variant="outline" className="w-full mt-4">
                    Edit Category
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button for Infinite Scrolling */}
      {hasNextPage && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More Categories"}
          </Button>
        </div>
      )}
    </div>
  );
}