// admin/articles/page.tsx
"use client";

import { api } from "@/utils/api";
import Link from "next/link";
import { useState } from "react";

export default function AdminArticlesListPage() {
  const [search, setSearch] = useState("");
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.article.list.useInfiniteQuery(
      {
        limit: 10,
        search,
        published: publishedFilter,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Articles</h1>
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/articles/new" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Create New Article
        </Link>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <select
            value={publishedFilter === undefined ? "all" : publishedFilter ? "true" : "false"}
            onChange={(e) => {
              const value = e.target.value;
              setPublishedFilter(
                value === "all" ? undefined : value === "true" ? true : false
              );
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div>Loading articles...</div>
      ) : articles.length === 0 ? (
        <div>No articles found.</div>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="p-4 border border-gray-200 rounded-md shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-gray-600 text-sm">
                  {article.published ? "Published" : "Draft"} -{" "}
                  {article.createdAt.toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm">
                  Categories: {article.categories.map(cat => cat.name).join(', ')}
                </p>
              </div>
              {/* <--- CRUCIAL CHANGE: Use article.slug in Link */}
              <Link href={`/admin/articles/${article.slug}`} className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
}