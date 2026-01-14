// ElevenLabs Text-to-Speech Client
export async function generateSpeech(text, voiceId = 'EXAVITQu4vr4xnSDxMaL') {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return audioBuffer;
  } catch (error) {
    console.error('ElevenLabs error:', error);
    // Fallback to browser speech synthesis
    return null;
  }
}

// Get available voices from ElevenLabs
export async function getElevenLabsVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.status}`);
    }

    const data = await response.json();
    return data.voices;
  } catch (error) {
    console.error('Failed to get ElevenLabs voices:', error);
    return [];
  }
}

// Play audio from ElevenLabs
export function playAudio(audioBuffer) {
  return new Promise((resolve, reject) => {
    if (!audioBuffer) {
      resolve();
      return;
    }

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      audioContext.decodeAudioData(audioBuffer, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        
        source.onended = () => {
          resolve();
          // Close context to free resources
          if (audioContext.state !== 'closed') {
            audioContext.close();
          }
        };
        
        source.start(0);
      }, (err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}
