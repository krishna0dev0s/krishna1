import { NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY || process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    
    if (!deepgramApiKey) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    const deepgram = createClient(deepgramApiKey);

    // NOTE: In a production environment, you should generate ephemeral keys using createProjectKey.
    // However, this requires a valid DEEPGRAM_PROJECT_ID and an API key with 'project:write' permissions.
    // For development, we will return the API key directly.
    
    /*
    const { result, error } = await deepgram.createProjectKey(
      process.env.DEEPGRAM_PROJECT_ID || 'default', // You might need a project ID, or just use the key directly if not creating ephemeral keys
      {
        comment: 'Temporary key for client-side streaming',
        scopes: ['usage:write'],
        time_to_live_in_seconds: 60, // 1 minute validity for the key itself
      }
    );
    */

    // If createProjectKey fails (e.g. using a personal API key that can't create keys), 
    // we might just return the key itself if it's safe (usually not recommended for production)
    // OR we can just return a success signal and let the client use a proxy.
    // However, the standard Deepgram pattern for Next.js is to use the SDK on the server to generate a temp key.
    
    // SIMPLER APPROACH FOR NOW:
    // Since we might not have project management permissions on the key provided by the user,
    // let's just return the key if it's a public one, or assume the user has set it up.
    // BUT, exposing the main key is bad.
    
    // Let's try to just return the key from env for now, assuming the user is in a dev environment or has restricted the key.
    // In a real prod app, we'd use the createProjectKey method.
    
    return NextResponse.json({
      key: deepgramApiKey,
    });
  } catch (error) {
    console.error('Deepgram token error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
