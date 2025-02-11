'use client';

import { stripHTML } from '../lib/utils';

export type FeedItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  link: string;
};

type MainContentProps = {
  items: FeedItem[];
  selectedItemId: string | null;
  onSelectItem: (item: FeedItem) => void;
  isLoading?: boolean;
};

export function MainContent({ items, selectedItemId, onSelectItem, isLoading = false }: MainContentProps) {
  if (isLoading) {
    return (
      <div className="w-[400px] h-screen overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-[400px] h-screen overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No items to display
        </div>
      </div>
    );
  }

  return (
    <div className="w-[400px] h-screen overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Feed Items</h1>
        <div className="space-y-6">
          {items.map((item) => (
            <article 
              key={item.id} 
              className={`p-4 rounded-lg border cursor-pointer
                ${selectedItemId === item.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                } transition-colors`}
              onClick={() => onSelectItem(item)}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {stripHTML(item.title)}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                {stripHTML(item.description)}
              </p>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(item.date).toLocaleDateString()}
              </time>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
} 