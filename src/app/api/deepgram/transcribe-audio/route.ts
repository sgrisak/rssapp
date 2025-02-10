import { NextResponse } from 'next/server';
import { Deepgram } from '@deepgram/sdk';

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

if (!deepgramApiKey) {
  throw new Error('DEEPGRAM_API_KEY is not set in environment variables');
}

// Initialize Deepgram with v1 format
const deepgram = new Deepgram(deepgramApiKey);

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // First, try to get the audio file
    const audioResponse = await fetch(url);
    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch audio file' },
        { status: 404 }
      );
    }

    // Get the audio file as a buffer
    const audioBuffer = await audioResponse.arrayBuffer();

    // Send to Deepgram for transcription using v1 format
    const source = {
      buffer: Buffer.from(audioBuffer),
      mimetype: audioResponse.headers.get('content-type') || 'audio/mpeg'
    };

    const response = await deepgram.transcription.preRecorded(source, {
      punctuate: true,
      model: 'general',
      language: 'en-US'
    });

    // Return both the audio URL and the transcript
    return NextResponse.json({
      audioUrl: url,
      transcript: response.results?.channels[0]?.alternatives[0]?.transcript || '',
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 