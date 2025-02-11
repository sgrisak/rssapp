'use client';

import { useState, useEffect } from 'react';
import { sanitizeAndParseHTML, stripHTML } from '../lib/utils';
import { TranscriptModal } from './TranscriptModal';

type ContentPanelProps = {
  selectedItem: {
    id: string;
    title: string;
    content: string;
    description: string;
    date: string;
    link: string;
    audioUrl: string | null;
  } | null;
};

type AudioTranscriptState = {
  isLoading: boolean;
  audioUrl: string | null;
  transcript: string | null;
  error: string | null;
};

export function ContentPanel({ selectedItem }: ContentPanelProps) {
  const [audioTranscript, setAudioTranscript] = useState<AudioTranscriptState>({
    isLoading: false,
    audioUrl: null,
    transcript: null,
    error: null,
  });
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  // Reset audio transcript state when selected item changes
  useEffect(() => {
    setAudioTranscript({
      isLoading: false,
      audioUrl: null,
      transcript: null,
      error: null,
    });
    setIsTranscriptOpen(false);
  }, [selectedItem?.id]); // Reset when the selected item's ID changes

  const handleGetAudioTranscript = async () => {
    if (!selectedItem || !selectedItem.audioUrl) {
      setAudioTranscript(prev => ({
        ...prev,
        error: 'No audio file available for this item.',
      }));
      return;
    }

    setAudioTranscript(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('/api/deepgram/transcribe-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: selectedItem.audioUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio and transcript');
      }

      const data = await response.json();
      setAudioTranscript({
        isLoading: false,
        audioUrl: data.audioUrl,
        transcript: data.transcript,
        error: null,
      });
    } catch (error) {
      setAudioTranscript(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch audio and transcript. Please try again.',
      }));
    }
  };

  if (!selectedItem) {
    return (
      <div className="flex-1 h-screen overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          Select an item to view its content
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 h-screen overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stripHTML(selectedItem.title)}
            </h1>
            {selectedItem.audioUrl && (
              <button
                onClick={handleGetAudioTranscript}
                disabled={audioTranscript.isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 
                         hover:bg-blue-600 rounded-md disabled:opacity-50"
              >
                {audioTranscript.isLoading ? 'Loading...' : 'Get Audio & Transcript'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(selectedItem.date).toLocaleDateString()}
            </time>
            {selectedItem.link && (
              <a
                href={selectedItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View Original →
              </a>
            )}
          </div>

          {audioTranscript.error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {audioTranscript.error}
            </div>
          )}

          {audioTranscript.audioUrl && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Audio</h2>
              <audio controls className="w-full">
                <source src={audioTranscript.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {audioTranscript.transcript && (
            <div className="mb-6">
              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                         rounded-md transition-colors"
              >
                View Transcript
              </button>
            </div>
          )}

          <div className="prose dark:prose-invert max-w-none">
            {sanitizeAndParseHTML(selectedItem.content || selectedItem.description)}
          </div>
        </div>
      </div>

      {audioTranscript.transcript && (
        <TranscriptModal
          isOpen={isTranscriptOpen}
          onClose={() => setIsTranscriptOpen(false)}
          transcript={audioTranscript.transcript}
        />
      )}
    </>
  );
} 