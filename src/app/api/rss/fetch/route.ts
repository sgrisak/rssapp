import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const parser = new Parser({
  defaultRSS: 2.0,
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['description', 'description'],
      ['enclosure', 'enclosure'],
    ],
  },
});

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch the RSS feed through our API to avoid CORS issues
    const response = await fetch(url);
    const xml = await response.text();
    const feed = await parser.parseString(xml);

    // Transform the feed data into a cleaner format
    const transformedFeed = {
      title: feed.title || 'Untitled Feed',
      items: feed.items.map(item => ({
        id: item.guid || item.link || item.title,
        title: item.title || 'Untitled Item',
        description: item.description || '',
        content: item.content || item.description || '',
        date: item.pubDate || item.isoDate || new Date().toISOString(),
        link: item.link || '',
        audioUrl: item.enclosure?.url || null,
      })),
    };

    return NextResponse.json(transformedFeed);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    );
  }
} 