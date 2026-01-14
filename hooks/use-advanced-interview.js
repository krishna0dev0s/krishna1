// Hook for using advanced features in components
'use client';

import { useRef, useCallback, useState } from 'react';

export function useAdvancedInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start recording audio
  const startRecording = useCallback(async () => {
    // Check browser compatibility
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser does not support microphone access');
      throw new Error('Your browser doesn\'t support microphone access. Please use a modern browser.');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        }
      });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      
      // Provide specific error messages
      let errorMessage = 'Failed to access microphone';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone permission denied. Please allow access in browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Microphone is in use by another application.';
      }
      
      throw new Error(errorMessage);
    }
  }, []);

  // Stop recording and transcribe
  const stopRecording = useCallback(async () => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) return;

      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        // Call advanced transcription endpoint
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append(
            'options',
            JSON.stringify({
              withSentiment: true,
              withSpeakerDiarization: false,
            })
          );

          const response = await fetch('/api/interview/advanced-transcribe', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          if (data.success) {
            setTranscript(data.transcript);
            setConfidence(data.confidence);
            if (data.metadata?.sentiment) {
              setSentiment(data.metadata.sentiment.overall);
            }
          }

          resolve(data);
        } catch (error) {
          console.error('Transcription error:', error);
          resolve(null);
        }
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }, []);

  // Speak using advanced TTS
  const speakWithEmotion = useCallback(async (text, emotion = 'warm') => {
    try {
      const response = await fetch('/api/interview/advanced-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          emotion,
          useStreaming: true,
          analyzeQuality: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Convert base64 to audio and play
        const audioBytes = Uint8Array.from(atob(data.audio), (c) =>
          c.charCodeAt(0)
        );
        const audioBlob = new Blob([audioBytes], { type: 'audio/mpeg' });
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();

        return {
          success: true,
          latency: data.metadata?.latency,
          quality: data.metadata?.quality?.quality?.level,
        };
      }
    } catch (error) {
      console.error('TTS error:', error);
    }

    return { success: false };
  }, []);

  // Track metrics for an interview
  const trackAnswer = useCallback(async (interviewId, questionId, answer) => {
    try {
      const response = await fetch('/api/interview/advanced-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track-answer',
          interviewId,
          data: {
            questionId,
            answer,
            duration: 0, // Would be actual recording duration
            confidence,
            sentiment,
            speakingTime: 0,
          },
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Metrics error:', error);
      return false;
    }
  }, [confidence, sentiment]);

  return {
    isRecording,
    transcript,
    sentiment,
    confidence,
    startRecording,
    stopRecording,
    speakWithEmotion,
    trackAnswer,
  };
}
