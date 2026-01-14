'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { toast } from 'sonner';

export function useDeepgram() {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected, connecting, connected, error
  const [error, setError] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);

  const deepgramRef = useRef(null);
  const microphoneRef = useRef(null);
  const streamRef = useRef(null);

  const startDeepgram = useCallback(async () => {
    try {
      setConnectionState('connecting');
      setError(null);

      // 1. Get the API key
      const response = await fetch('/api/deepgram/token');
      const data = await response.json();

      if (!data.key) {
        throw new Error('Failed to get Deepgram API key');
      }

      // 2. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;
      setMediaStream(stream);

      // 3. Connect to Deepgram
      console.log('🔐 Connecting to Deepgram with key length:', data.key?.length);
      
      if (!data?.key) {
        console.error('❌ No Deepgram API key received from server');
        setError('Failed to retrieve Deepgram API key');
        setConnectionState('error');
        return;
      }

      const deepgram = createClient(data.key);
      
      const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        interim_results: true,
        punctuate: true,
        endpointing: 300,
      });

      // 4. Handle events
      connection.on(LiveTranscriptionEvents.Open, () => {
        console.log('🟢 Deepgram connection opened');
        setConnectionState('connected');
        setIsListening(true);

        // Send audio data
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        microphoneRef.current = mediaRecorder;

        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && connection.getReadyState() === 1) {
            connection.send(event.data);
          }
        });

        mediaRecorder.start(250); // Send chunks every 250ms
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const sentence = data.channel.alternatives[0].transcript;
        
        if (sentence) {
          if (data.is_final) {
            setTranscript((prev) => prev + ' ' + sentence);
            setInterimTranscript('');
          } else {
            setInterimTranscript(sentence);
          }
        }
      });

      connection.on(LiveTranscriptionEvents.Close, (event) => {
        console.log('🔴 Deepgram connection closed', event);
        setConnectionState('disconnected');
        setIsListening(false);
      });

      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error('❌ Deepgram error:', err);
        // Try to extract meaningful error message
        const msg = err.message || (err.type === 'error' ? 'WebSocket connection failed' : 'Unknown error');
        setError(msg);
        setConnectionState('error');
        toast.error(`Deepgram Error: ${msg}`);
      });

      deepgramRef.current = connection;

    } catch (err) {
      console.error('Failed to start Deepgram:', err);
      setError(err.message);
      setConnectionState('error');
      toast.error(`Failed to start microphone: ${err.message}`);
      
      // Cleanup if failed
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  const stopDeepgram = useCallback(() => {
    if (microphoneRef.current && microphoneRef.current.state !== 'inactive') {
      microphoneRef.current.stop();
    }

    if (deepgramRef.current) {
      deepgramRef.current.finish();
      deepgramRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setMediaStream(null);
    }

    setIsListening(false);
    setConnectionState('disconnected');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDeepgram();
    };
  }, [stopDeepgram]);

  return {
    isListening,
    transcript,
    interimTranscript,
    connectionState,
    error,
    mediaStream,
    startDeepgram,
    stopDeepgram,
    clearTranscript,
  };
}
