'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, SkipForward, RotateCcw, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { useDeepgram } from '@/hooks/use-deepgram';

/**
 * Animated Voice Interview - Matching Reference UI
 * Beautiful waveform animations and smooth transitions
 */
export default function AnimatedVoiceInterview({ company, job, onBack, onComplete }) {
  const { 
    isListening: isDeepgramListening, 
    transcript: deepgramTranscript, 
    interimTranscript: deepgramInterim, 
    startDeepgram, 
    stopDeepgram, 
    clearTranscript,
    mediaStream 
  } = useDeepgram();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState('start');
  
  const synthRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Sync Deepgram state
  useEffect(() => {
    setIsListening(isDeepgramListening);
  }, [isDeepgramListening]);

  useEffect(() => {
    setTranscript(deepgramTranscript);
  }, [deepgramTranscript]);

  useEffect(() => {
    setInterimText(deepgramInterim);
  }, [deepgramInterim]);

  // Initialize
  useEffect(() => {
    console.log('🎙️ Initializing Animated Voice Interview with Deepgram...');
    
    // Initialize Speech Synthesis
    synthRef.current = window.speechSynthesis;
    
    // Start interview
    startInterview();
    
    return () => {
      stopDeepgram();
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Audio Visualization using Deepgram stream
  useEffect(() => {
    if (mediaStream && !audioContextRef.current) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(mediaStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      } catch (e) {
        console.error('Audio visualization setup failed:', e);
      }
    }
  }, [mediaStream]);
  
  // Waveform Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let time = 0;
    const baseAmplitude = isListening ? 40 : 20;
    const targetAmplitude = isListening ? 60 : 20;
    let currentAmplitude = baseAmplitude;
    
    const animate = () => {
      time += 0.05;
      currentAmplitude += (targetAmplitude - currentAmplitude) * 0.1;
      
      // Use real audio data if available
      if (isListening && analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        // Boost the visual effect based on volume
        if (average > 10) {
          currentAmplitude = Math.max(currentAmplitude, average * 1.5);
        }
      }
      
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      // Draw main wave
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const y = height / 2 + 
          Math.sin(x * 0.02 + time) * currentAmplitude * (isListening ? 1 : 0.5) +
          Math.sin(x * 0.03 + time * 1.5) * (currentAmplitude * 0.5) * (isListening ? 1 : 0.3);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw secondary wave
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += 2) {
        const y = height / 2 + 
          Math.sin(x * 0.025 - time * 1.2) * (currentAmplitude * 0.7) * (isListening ? 1 : 0.4) +
          Math.sin(x * 0.035 - time * 0.8) * (currentAmplitude * 0.4) * (isListening ? 1 : 0.3);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening]);
  
  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'start',
          company,
          jobTitle: job?.title || job,
          conversationHistory: []
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAiResponse(data.response);
        setMessages([{ role: 'interviewer', content: data.response }]);
        setTimeout(() => speakText(data.response), 500);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMicrophone = async () => {
    // Interrupt AI if speaking
    if (isSpeaking) {
      console.log('🛑 Interrupting AI to speak...');
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeaking(false);
      
      // Small delay to ensure audio is cleared
      setTimeout(() => {
        startDeepgram();
      }, 200);
      return;
    }

    if (isListening) {
      // Stopping mic
      console.log('🛑 Stopping Deepgram microphone');
      stopDeepgram();
      
      // Submit if we have transcript
      const currentAnswer = (transcript + (interimText || '')).trim();
      if (currentAnswer) {
        console.log('🎤 Mic muted with transcript, submitting...');
        await submitAnswer();
      }
    } else {
      // Starting mic
      console.log('🎤 Starting Deepgram microphone...');
      startDeepgram();
    }
  };
  
  const submitAnswer = async (overrideText = null) => {
    const answer = typeof overrideText === 'string' ? overrideText : (transcript + (interimText || '')).trim();
    if (!answer) return;
    
    setLoading(true);
    const userMessage = { role: 'candidate', content: answer };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Clear transcript via hook
    clearTranscript();
    
    // Stop mic while processing
    stopDeepgram();
    
    try {
      const response = await fetch('/api/interview/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          company,
          jobTitle: job?.title || job,
          userResponse: answer,
          conversationHistory: updatedMessages
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAiResponse(data.response);
        setMessages([...updatedMessages, { role: 'interviewer', content: data.response }]);
        setPhase(data.phase || phase);
        setTimeout(() => speakText(data.response), 300);
      }
    } catch (error) {
      toast.error('Failed to process answer');
    } finally {
      setLoading(false);
    }
  };
  
  const speakText = (text) => {
    if (!synthRef.current) return;
    
    setIsSpeaking(true);
    // If listening, stop listening while speaking
    stopDeepgram();
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-resume listening after speaking
      // Increased delay to prevent self-transcription (echo)
      setTimeout(() => {
        // Only resume if we were in a "listening" flow (optional, but good for auto-turn-taking)
        // For now, we'll let the user manually toggle or just rely on the fact that they stopped speaking
        // But to match the "echo prevention" request:
        // We don't auto-start mic here unless we want continuous conversation.
        // The previous code did auto-start. Let's keep it but with delay.
        startDeepgram();
      }, 1500);
    };
    
    synthRef.current.speak(utterance);
  };

  const skipQuestion = () => {
    if (loading || isSpeaking) return;
    toast.info('Skipping question...');
    submitAnswer("I would like to skip this question. Please provide the next one.");
  };

  const repeatQuestion = () => {
    if (isSpeaking) return;
    const lastInterviewerMessage = [...messages].reverse().find(msg => msg.role === 'interviewer');
    if (lastInterviewerMessage) {
      toast.info('Repeating question...');
      speakText(lastInterviewerMessage.content);
    }
  };
  
  const displayText = transcript + (interimText ? ' ' + interimText : '');
  const currentText = displayText || aiResponse || 'Hey, GET I need your help on one of my new projects chatbots about tree organizing...';
  
  return (
    <div className="fixed inset-0 bg-[#0a0e27] flex items-center justify-center z-50 overflow-hidden">
      {/* Glowing orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>
      
      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10"
      >
        {/* Outer glow ring */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))',
              filter: 'blur(30px)',
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Card */}
          <motion.div
            className="relative w-[400px] h-[500px] rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(59, 130, 246, 0.05)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onBack}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            {/* Content */}
            <div className="flex flex-col h-full p-8 pt-12">
              {/* Text Display */}
              <div className="flex-1 flex items-center justify-center overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <motion.div
                  key={currentText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center px-6"
                >
                  <p className="text-white text-lg leading-relaxed font-light">
                    {currentText}
                  </p>
                </motion.div>
              </div>
              
              {/* Waveform Canvas */}
              <div className="my-8">
                <canvas
                  ref={canvasRef}
                  width={350}
                  height={100}
                  className="w-full"
                />
              </div>
              
              {/* Microphone Button */}
              <div className="flex justify-center pb-4 gap-4 items-center">
                <motion.button
                  onClick={skipQuestion}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="Skip Question"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </motion.button>

                <motion.button
                  onClick={toggleMicrophone}
                  className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {/* Pulsing ring when listening */}
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-full bg-blue-500"
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          exit={{ scale: 1, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-full bg-blue-400"
                          initial={{ scale: 1, opacity: 0.4 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          exit={{ scale: 1, opacity: 0 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: 0.3,
                          }}
                        />
                      </>
                    )}
                  </AnimatePresence>
                  
                  {/* Icon */}
                  <motion.div
                    animate={{
                      scale: isListening ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isListening ? Infinity : 0,
                    }}
                  >
                    {isListening ? (
                      <Mic className="w-7 h-7 text-blue-600" />
                    ) : isSpeaking ? (
                      <VolumeX className="w-7 h-7 text-red-500" />
                    ) : (
                      <MicOff className="w-7 h-7 text-gray-700" />
                    )}
                  </motion.div>
                </motion.button>

                <motion.button
                  onClick={repeatQuestion}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  title="Repeat Question"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              
              {/* Status indicator */}
              <div className="text-center">
                <motion.div
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-400 font-medium tracking-wide">
                    {loading ? 'Processing...' : isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Tap to speak'}
                  </span>
                </motion.div>
              </div>
            </div>
            
            {/* Bottom gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(59, 130, 246, 0.2) 0%, transparent 100%)',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
