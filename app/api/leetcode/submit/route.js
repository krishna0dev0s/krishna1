import { NextResponse } from 'next/server';

// Placeholder proxy endpoint for LeetCode submissions.
// Replace the TODO block with real integration (headless browser or upstream proxy
// that holds authenticated LeetCode session cookies). Never expose user creds client-side.
export async function POST(request) {
  try {
    const body = await request.json();
    const { problemNumber, language, code } = body || {};

    // TODO: forward to a secured backend service that performs the actual
    // LeetCode submission and returns verdict/runtime/memory.
    // Example:
    // const proxyRes = await fetch(process.env.LEETCODE_PROXY_URL + '/submit', { ... });
    // const data = await proxyRes.json();
    // return NextResponse.json(data);

    // Stubbed OK response so the UI works without a backend proxy
    return NextResponse.json(
      {
        message: 'Stubbed submission: replace with real proxy when ready',
        status: 'submitted (stub)',
        verdict: 'Accepted (simulated)',
        runtime: '63 ms',
        memory: '8.2 MB',
        echo: { problemNumber, language, codeLength: code?.length || 0 },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submit proxy error:', error);
    return NextResponse.json({ message: 'Submission error', error: String(error) }, { status: 500 });
  }
}
