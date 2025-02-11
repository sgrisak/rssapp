'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { AddFeedDialog } from './AddFeedDialog';

export type Feed = {
  id: string;
  title: string;
  url: string;
};

type SidebarProps = {
  feeds: Feed[];
  selectedFeedId: string | null;
  onSelectFeed: (feed: Feed | null) => void;
  onAddFeed: (url: string) => Promise<void>;
};

export function Sidebar({ feeds, selectedFeedId, onSelectFeed, onAddFeed }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <div className="w-64 h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="w-full mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Feed
          </button>
          <button
            onClick={toggleTheme}
            className="w-full mb-4 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        <div className="px-4">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">MY FEEDS</h2>
          <ul className="space-y-1">
            <li>
              <button
                className={`w-full text-left px-2 py-1.5 rounded-lg 
                  ${selectedFeedId === null
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                onClick={() => onSelectFeed(null)}
              >
                All Feeds
              </button>
            </li>
            {feeds.length === 0 ? (
              <li>
                <p className="text-gray-500 dark:text-gray-400 text-sm px-2 py-1.5">
                  No feeds added yet. Click "Add Feed" to get started.
                </p>
              </li>
            ) : (
              feeds.map((feed) => (
                <li key={feed.id}>
                  <button
                    className={`w-full text-left px-2 py-1.5 rounded-lg 
                      ${selectedFeedId === feed.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    onClick={() => onSelectFeed(feed)}
                  >
                    {feed.title}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <AddFeedDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={onAddFeed}
      />
    </>
  );
} 