import { NextResponse } from 'next/server';

// Placeholder proxy for running code in a sandbox. Replace with real runner (e.g.,
// containerized judge or third-party sandbox). Do NOT execute untrusted code in-process.
export async function POST(request) {
  try {
    const body = await request.json();
    const { language, code, input } = body || {};

    // TODO: forward to secured sandbox runner
    // const runnerRes = await fetch(process.env.CODE_RUNNER_URL + '/run', { ... });
    // const data = await runnerRes.json();
    // return NextResponse.json(data);

    // Stubbed OK response so the UI works without an external runner
    return NextResponse.json(
      {
        message: 'Stubbed run: replace with real sandbox runner when ready',
        status: 'ran (stub)',
        stdout: 'Sample output from stub runner',
        stderr: '',
        runtime: '58 ms',
        memory: '7.9 MB',
        echo: { language, codeLength: code?.length || 0, inputLength: input?.length || 0 },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Run proxy error:', error);
    return NextResponse.json({ message: 'Run error', error: String(error) }, { status: 500 });
  }
}
