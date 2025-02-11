'use client';

import { useState, useEffect } from 'react';
import { Sidebar, Feed } from './components/Sidebar';
import { MainContent, FeedItem } from './components/MainContent';
import { ContentPanel } from './components/ContentPanel';

export default function Home() {
  // Feed state
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allItems, setAllItems] = useState<FeedItem[]>([]);

  // Fetch items for all feeds when feeds change
  useEffect(() => {
    const fetchAllFeeds = async () => {
      const allFeedItems: FeedItem[] = [];
      for (const feed of feeds) {
        try {
          const response = await fetch('/api/rss/fetch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: feed.url }),
          });

          if (response.ok) {
            const feedData = await response.json();
            allFeedItems.push(...feedData.items);
          }
        } catch (error) {
          console.error(`Error fetching feed ${feed.url}:`, error);
        }
      }

      // Sort all items by date
      allFeedItems.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setAllItems(allFeedItems);
      if (!selectedFeed) {
        setFeedItems(allFeedItems);
      }
    };

    fetchAllFeeds();
  }, [feeds]);

  const handleAddFeed = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rss/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      const feed = await response.json();
      const newFeed: Feed = {
        id: url,
        title: feed.title,
        url: url,
      };

      setFeeds(prev => [...prev, newFeed]);
      setSelectedFeed(newFeed);
      setFeedItems(feed.items);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error adding feed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFeed = async (feed: Feed | null) => {
    setIsLoading(true);
    setSelectedFeed(feed);
    setSelectedItem(null);

    if (!feed) {
      // Show all items when "All Feeds" is selected
      setFeedItems(allItems);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/rss/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: feed.url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      const feedData = await response.json();
      setFeedItems(feedData.items);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setFeedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen">
      <Sidebar
        feeds={feeds}
        selectedFeedId={selectedFeed?.id ?? null}
        onSelectFeed={handleSelectFeed}
        onAddFeed={handleAddFeed}
      />
      <MainContent
        items={feedItems}
        selectedItemId={selectedItem?.id ?? null}
        onSelectItem={setSelectedItem}
        isLoading={isLoading}
      />
      <ContentPanel selectedItem={selectedItem} />
    </main>
  );
}
