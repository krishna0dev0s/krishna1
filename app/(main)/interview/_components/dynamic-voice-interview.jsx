'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Pause, Play, RotateCcw, Download, Zap, Brain, MessageSquare, Clock, Send, Keyboard, Type, SkipForward } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { generateSpeech, playAudio } from '@/lib/elevenlabs-client';
import { toast } from 'sonner';
import { useDeepgram } from '@/hooks/use-deepgram';
import { Textarea } from '@/components/ui/textarea';

/**
 * Enhanced AI-Driven Voice Interview with Maximum UX
 * Features: Auto-recording, Visual feedback, Sentiment analysis, Voice controls
 */
export default function DynamicVoiceInterview({ company, job, onBack, onComplete }) {
  // Deepgram Hook
  const { 
    isListening: isDeepgramListening, 
    transcript: deepgramTranscript, 
    interimTranscript: deepgramInterim, 
    startDeepgram, 
    stopDeepgram, 
    clearTranscript: clearDeepgramTranscript,
    mediaStream 
  } = useDeepgram();

  // Core state
  const [isMicOn, setIsMicOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState('start');
  const [candidateName, setCandidateName] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  
  // Enhanced UX state
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [autoRecording, setAutoRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [averageResponseTime, setAverageResponseTime] = useState(0);
  const [responseStartTime, setResponseStartTime] = useState(null);
  const [sentiment, setSentiment] = useState('neutral');
  const [confidence, setConfidence] = useState(0);
  const [silenceTimer, setSilenceTimer] = useState(0);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [interviewDuration, setInterviewDuration] = useState(0);
  
  // Refs
  const conversationEndRef = useRef(null);
  const synthRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const durationIntervalRef = useRef(null);

  // Timer
  useEffect(() => {
    durationIntervalRef.current = setInterval(() => {
      setInterviewDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(durationIntervalRef.current);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !isKeyboardMode && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleMic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMicOn, isKeyboardMode]);

  // Sync Deepgram state
  useEffect(() => {
    setIsListening(isDeepgramListening);
    // Don't sync isMicOn here, as it represents user intent, while isDeepgramListening represents actual connection state
    // setIsMicOn(isDeepgramListening); 
  }, [isDeepgramListening]);

  useEffect(() => {
    setUserTranscript(deepgramTranscript);
    currentTranscriptRef.current = deepgramTranscript;
    setWordCount(deepgramTranscript.trim().split(/\s+/).length);
    setSentiment(analyzeSentiment(deepgramTranscript));
  }, [deepgramTranscript]);

  useEffect(() => {
    setInterimTranscript(deepgramInterim);
  }, [deepgramInterim]);

  // Initialize audio visualization
  useEffect(() => {
    if (mediaStream && !audioContextRef.current) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(mediaStream);
        
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        
        // Start visualizing with throttling
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let lastUpdate = 0;
        
        const visualize = (timestamp) => {
          if (timestamp - lastUpdate > 50) { // Update every ~50ms (20fps)
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(Math.min(100, average));
            lastUpdate = timestamp;
          }
          animationFrameRef.current = requestAnimationFrame(visualize);
        };
        animationFrameRef.current = requestAnimationFrame(visualize);
      } catch (error) {
        console.error('Audio visualization error:', error);
      }
    }
  }, [mediaStream]);

  // Analyze sentiment from text
  const analyzeSentiment = useCallback((text) => {
    if (!text) return 'neutral';
    const positiveWords = ['great', 'excellent', 'good', 'love', 'amazing', 'perfect', 'yes', 'absolutely'];
    const negativeWords = ['bad', 'terrible', 'no', 'never', 'hate', 'difficult', 'hard', 'struggle'];
    
    const lowerText = text.toLowerCase();
    const posCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (posCount > negCount) return 'positive';
    if (negCount > posCount) return 'negative';
    return 'neutral';
  }, []);

  // Initialize Text-to-Speech
  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      stopDeepgram();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [stopDeepgram]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Start interview automatically
  useEffect(() => {
    if (conversationHistory.length === 0) {
      startInterview();
    }
  }, [startInterview, conversationHistory.length]);

  // Start the interview
  const startInterview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'start',
          company: company,
          jobTitle: job?.title || job,
          conversationHistory: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.response) {
        setConversationHistory([
          { role: 'interviewer', content: data.response },
        ]);
        
        setInterviewPhase(data.phase || 'introduction');
        
        // Speak the greeting
        setTimeout(() => {
          speakResponse(data.response);
        }, 500);
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [company, job, speakResponse]);

  // Function to make AI speak with enhanced controls
  const speakResponse = useCallback(async (text) => {
    setIsSpeaking(true);
    
    // Pause mic while AI is speaking
    // We check isMicOn (user intent) to know if we should resume later
    if (isMicOn && autoRecording) {
      setIsPaused(true);
      stopDeepgram();
    }
    
    try {
      // Try ElevenLabs first for better voice quality
      if (process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
        try {
          const audioBuffer = await generateSpeech(text);
          if (audioBuffer) {
            await playAudio(audioBuffer);
            setIsSpeaking(false);
            
            // Resume mic after AI speaks ONLY if user intent (isMicOn) is still true
            // AND if we haven't been interrupted (isSpeaking check might be stale, so we rely on isMicOn)
            if (isMicOn && autoRecording) {
              setIsPaused(false);
              // Increased delay to 1.5s to prevent echo
              setTimeout(() => {
                // Double check intent before restarting
                if (isMicOn) startDeepgram();
              }, 1500);
            }
            return;
          }
        } catch (error) {
          console.log('ElevenLabs failed, falling back to browser TTS:', error.message);
        }
      }

      // Fallback to browser's speech synthesis with custom controls
      if (synthRef.current) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechRate;
        utterance.pitch = 1.0;
        utterance.volume = volume;

        // Get a good voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Natural') ||
          voice.name.includes('Premium') ||
          voice.name.includes('Enhanced')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
          
          // Resume mic after AI speaks ONLY if user intent (isMicOn) is still true
          if (isMicOn && autoRecording) {
            setIsPaused(false);
            // Increased delay to 1.5s to prevent echo
            setTimeout(() => {
              if (isMicOn) startDeepgram();
            }, 1500);
          }
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };

        synthRef.current.speak(utterance);
      } else {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Speech error:', error);
      toast.error('Failed to play audio response');
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isMicOn, autoRecording, stopDeepgram, startDeepgram, speechRate, volume]);
  
  // Stop AI speech
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // Submit answer and get AI response with analytics
  const submitAnswer = useCallback(async (overrideText = null) => {
    console.log('📤 Submit triggered');
    // Allow override for "Skip Question" feature
    const isOverride = typeof overrideText === 'string';
    const currentText = isOverride ? overrideText : currentTranscriptRef.current;

    console.log('User transcript (ref):', currentText);
    console.log('Interim transcript:', interimTranscript);
    
    if (!isOverride && (!currentText || !currentText.trim()) && (!interimTranscript || !interimTranscript.trim())) {
      toast.error('Please provide an answer before submitting');
      console.log('❌ No transcript to submit');
      return;
    }

    const finalTranscript = isOverride ? overrideText : ((currentText || '') + (interimTranscript || ''));
    console.log('✅ Final transcript to submit:', finalTranscript);
    
    // Calculate response time
    if (responseStartTime) {
      const responseTime = (Date.now() - responseStartTime) / 1000;
      setAverageResponseTime(prev => prev === 0 ? responseTime : (prev + responseTime) / 2);
    }

    setLoading(true);
    
    // Clear silence timer
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }

    try {
      // Detect candidate name from first response
      if (!candidateName && conversationHistory.length === 1) {
        const detectedName = finalTranscript.trim().split(/[,\s]+/)[0];
        setCandidateName(detectedName);
        toast.success(`Nice to meet you, ${detectedName}!`, { duration: 2000 });
      }

      // Add user response to conversation
      const updatedHistory = [
        ...conversationHistory,
        { role: 'candidate', content: finalTranscript, timestamp: new Date().toISOString(), wordCount: wordCount, sentiment: sentiment },
      ];

      setConversationHistory(updatedHistory);

      // Clear user transcript via hook
      clearDeepgramTranscript();
      setUserTranscript('');
      currentTranscriptRef.current = '';
      setInterimTranscript('');
      setWordCount(0);
      setSentiment('neutral');
      setConfidence(0);
      setResponseStartTime(null);

      // Get AI's next response
      const response = await fetch('/api/interview/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: interviewPhase,
          company: company,
          jobTitle: job?.title || job,
          candidateName: candidateName,
          userResponse: finalTranscript,
          conversationHistory: updatedHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.response) {
        // Add AI response to conversation
        const finalHistory = [
          ...updatedHistory,
          { role: 'interviewer', content: data.response, timestamp: new Date().toISOString() },
        ];

        setConversationHistory(finalHistory);
        setInterviewPhase(data.phase || interviewPhase);
        
        // Increment question count
        setQuestionCount(prev => prev + 1);

        // Check if interview should end (after ~10-15 exchanges)
        if (!data.shouldContinue || questionCount >= 12) {
          setTimeout(() => {
            handleEndInterview(finalHistory);
          }, 5000);
        }

        // Speak AI's response
        setTimeout(() => {
          speakResponse(data.response);
        }, 300);
      }
    } catch (error) {
      console.error('Submit answer error:', error);
      toast.error('Failed to process response. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [interimTranscript, responseStartTime, candidateName, conversationHistory, clearDeepgramTranscript, interviewPhase, company, job, questionCount, speakResponse, handleEndInterview, wordCount, sentiment]);

  // Skip current question
  const skipQuestion = useCallback(() => {
    if (loading || isSpeaking) return;
    toast.info('Skipping question...');
    submitAnswer("I would like to skip this question. Please provide the next one.");
  }, [loading, isSpeaking, submitAnswer]);

  // Repeat last question
  const repeatQuestion = useCallback(() => {
    if (isSpeaking) return;
    const lastInterviewerMessage = [...conversationHistory].reverse().find(msg => msg.role === 'interviewer');
    if (lastInterviewerMessage) {
      toast.info('Repeating question...');
      speakResponse(lastInterviewerMessage.content);
    } else {
      toast.error("No question to repeat yet.");
    }
  }, [isSpeaking, conversationHistory, speakResponse]);

  // Toggle microphone with visualization
  const toggleMic = useCallback(async () => {
    // If AI is speaking, stop it immediately and start listening (Interrupt mode)
    if (isSpeaking) {
      console.log('🛑 Interrupting AI to speak...');
      stopSpeaking();
      // Small delay to ensure audio is fully cleared before mic opens
      setTimeout(async () => {
        try {
          await startDeepgram();
          setIsMicOn(true);
          setIsPaused(false);
          setResponseStartTime(Date.now());
          toast.success('🎤 Microphone ON - I\'m listening!', { duration: 3000 });
        } catch (error) {
          console.error('Mic error:', error);
          toast.error('Failed to start microphone');
        }
      }, 200);
      return;
    }

    if (!isMicOn) {
      try {
        console.log('🎤 Starting Deepgram microphone...');
        await startDeepgram();
        setIsMicOn(true);
        setIsPaused(false);
        setResponseStartTime(Date.now());
        toast.success('🎤 Microphone ON - I\'m listening!', { duration: 3000 });
      } catch (error) {
        console.error('Mic error:', error);
        toast.error('Failed to start microphone');
      }
    } else {
      // Stop everything
      console.log('🛑 Manually stopping microphone');
      stopDeepgram();
      setIsMicOn(false); // Explicitly set user intent to OFF
      
      // Check if we have a transcript to submit when muting
      const hasFinal = currentTranscriptRef.current && currentTranscriptRef.current.trim().length > 0;
      const hasInterim = interimTranscript && interimTranscript.trim().length > 0;
      
      if (hasFinal || hasInterim) {
          console.log('🎤 Mic muted with transcript, submitting...');
          submitAnswer(); 
      }

      setIsListening(false);
      toast.info('🎤 Microphone OFF');
      setAudioLevel(0);
    }
  }, [isMicOn, isSpeaking, startDeepgram, stopDeepgram, interimTranscript, submitAnswer, stopSpeaking]);
  
  // Clear current transcript
  const clearTranscript = useCallback(() => {
    clearDeepgramTranscript();
    setUserTranscript('');
    currentTranscriptRef.current = ''; // Clear ref
    setInterimTranscript('');
    setWordCount(0);
    setSentiment('neutral');
    setConfidence(0);
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    toast.info('Transcript cleared');
  }, [clearDeepgramTranscript]);



  // Download transcript
  const downloadTranscript = useCallback(() => {
    const transcript = conversationHistory.map((msg, idx) => {
      const role = msg.role === 'interviewer' ? 'INTERVIEWER' : 'CANDIDATE';
      const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
      return `[${time}] ${role}: ${msg.content}`;
    }).join('\n\n');
    
    const blob = new Blob([`Interview Transcript\nCompany: ${company}\nPosition: ${job?.title || job}\nDate: ${new Date().toLocaleDateString()}\n\n${transcript}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${company}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript downloaded!');
  }, [conversationHistory, company, job]);

  // Handle interview end
  const handleEndInterview = useCallback((history) => {
    stopSpeaking();
    stopDeepgram();
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    toast.success('🎉 Interview completed successfully!');
    
    if (onComplete) {
      onComplete({
        conversationHistory: history,
        questionCount: questionCount,
        candidateName: candidateName,
        averageResponseTime: averageResponseTime.toFixed(1),
        totalWords: history.reduce((acc, msg) => acc + (msg.wordCount || 0), 0),
      });
    }
  }, [stopSpeaking, stopDeepgram, onComplete, questionCount, candidateName, averageResponseTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleEndInterview(conversationHistory)}
            className="gap-2"
          >
            <PhoneOff className="h-4 w-4" />
            End Interview
          </Button>
        </div>

        {/* Interview Info with Stats */}
        <Card className="mb-6 bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-400" />
                  AI Voice Interview
                </CardTitle>
                <CardDescription className="text-gray-300 mt-2">
                  {company} - {job?.title || job}
                  {candidateName && ` | Interviewing: ${candidateName}`}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTranscript}
                disabled={conversationHistory.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Questions</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  {questionCount}
                </div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Avg Response</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  {averageResponseTime.toFixed(1)}s
                </div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Confidence</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  {confidence}%
                </div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Sentiment</div>
                <Badge variant={sentiment === 'positive' ? 'default' : sentiment === 'negative' ? 'destructive' : 'secondary'}>
                  {sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😟' : '😐'} {sentiment}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Display */}
        <Card className="mb-6 bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {conversationHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'interviewer' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg transition-all ${
                      message.role === 'interviewer'
                        ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30'
                        : 'bg-green-600/20 text-green-100 border border-green-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold">
                        {message.role === 'interviewer' ? '🎙️ Interviewer' : '👤 You'}
                      </div>
                      {message.timestamp && (
                        <div className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                    <div className="text-sm">{message.content}</div>
                    {message.wordCount > 0 && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{message.wordCount} words</span>
                        {message.sentiment && (
                          <Badge variant="outline" className="text-xs">
                            {message.sentiment === 'positive' ? '😊' : message.sentiment === 'negative' ? '😟' : '😐'}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-blue-600/20 text-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse">🤔</div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={conversationEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Input Section */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Audio Visualization */}
              {isMicOn && (
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Audio Level</span>
                    <span className="text-xs text-gray-400">{Math.round(audioLevel)}%</span>
                  </div>
                  <Progress value={audioLevel} className="h-2" />
                  <div className="flex items-center gap-2 mt-2">
                    {isListening && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-4 bg-red-500 animate-pulse rounded"></div>
                        <div className="w-1 h-6 bg-red-500 animate-pulse rounded" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-5 bg-red-500 animate-pulse rounded" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-xs text-red-400 ml-2">Listening...</span>
                      </div>
                    )}
                    {isPaused && (
                      <Badge variant="outline" className="text-yellow-400">
                        <Pause className="h-3 w-3 mr-1" />
                        Paused (AI Speaking)
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Transcript Display with Analytics */}
              <div className="min-h-[120px] max-h-[250px] overflow-y-auto p-4 bg-black/20 rounded-lg text-white border border-white/10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-transparent backdrop-blur-sm pb-2 z-10">
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Your Response:
                    {confidence > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {confidence}% confident
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsKeyboardMode(!isKeyboardMode)}
                      className={`h-6 px-2 text-xs ${isKeyboardMode ? 'text-blue-400' : ''}`}
                    >
                      {isKeyboardMode ? <Mic className="h-3 w-3 mr-1" /> : <Keyboard className="h-3 w-3 mr-1" />}
                      {isKeyboardMode ? 'Switch to Voice' : 'Switch to Text'}
                    </Button>
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span className="capitalize">{sentiment}</span>
                    {userTranscript && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearTranscript}
                        className="h-6 px-2 text-xs"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {isKeyboardMode ? (
                  <Textarea
                    value={userTranscript}
                    onChange={(e) => {
                      setUserTranscript(e.target.value);
                      currentTranscriptRef.current = e.target.value;
                      setWordCount(e.target.value.trim().split(/\s+/).length);
                    }}
                    placeholder="Type your answer here..."
                    className="bg-transparent border-none text-white resize-none focus-visible:ring-0 min-h-[80px]"
                  />
                ) : (
                  <div className="text-base leading-relaxed min-h-[60px]">
                    <span className="text-white font-medium">{userTranscript}</span>
                    {interimTranscript && (
                      <span className="text-blue-400 italic ml-1 animate-pulse">{interimTranscript}</span>
                    )}
                    {!userTranscript && !interimTranscript && (
                      <span className="text-gray-500 italic">
                        {isMicOn ? '🎤 Listening... start speaking!' : 'Click "Start Mic" button or press Space to begin...'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Voice Controls */}
              <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-lg">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-400">Speech Rate</label>
                    <span className="text-xs text-white">{speechRate.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[speechRate]}
                    onValueChange={(val) => setSpeechRate(val[0])}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-400">Volume</label>
                    <span className="text-xs text-white">{Math.round(volume * 100)}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={(val) => setVolume(val[0])}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={toggleMic}
                    size="lg"
                    variant={isMicOn ? 'destructive' : 'default'}
                    className="gap-2"
                  >
                    {isMicOn ? (
                      <>
                        <MicOff className="h-5 w-5" />
                        Stop Mic
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        Start Mic
                      </>
                    )}
                  </Button>

                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      variant="outline"
                      size="lg"
                      className="gap-2 text-yellow-400"
                    >
                      <VolumeX className="h-5 w-5" />
                      Stop AI
                    </Button>
                  )}

                  <Button onClick={repeatQuestion} variant="outline" size="icon" title="Repeat Question">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button onClick={skipQuestion} variant="outline" size="icon" title="Skip Question">
                    <SkipForward className="h-5 w-5" />
                  </Button>

                  {/* Manual Submit Button */}
                  {(userTranscript.trim().length > 0 || interimTranscript.trim().length > 0) && !loading && (
                    <Button
                      onClick={submitAnswer}
                      variant="default"
                      size="lg"
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-5 w-5" />
                      Send Answer
                    </Button>
                  )}
                  
                  {/* Test Recognition Button */}
                  {isMicOn && (
                    <Button
                      onClick={() => {
                        console.log('=== DIAGNOSTIC CHECK ===');
                        console.log('Mic On:', isMicOn);
                        console.log('Is Listening:', isListening);
                        console.log('Recognition object:', recognitionRef.current);
                        console.log('User Transcript:', userTranscript);
                        console.log('Interim:', interimTranscript);
                        console.log('Ref Transcript:', currentTranscriptRef.current);
                        toast.info('Check console (F12) for diagnostics');
                      }}
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                    >
                      🔍 Debug
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoRecord"
                      checked={autoRecording}
                      onChange={(e) => setAutoRecording(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="autoRecord" className="text-sm text-gray-300 cursor-pointer">
                      Auto-submit
                    </label>
                  </div>
                </div>


              </div>

              {/* Phase Indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 pt-2 border-t border-white/10">
                <Badge variant="outline" className="text-xs">
                  Phase: {interviewPhase}
                </Badge>
                <span>•</span>
                <span>Question {questionCount}/~12</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.floor(interviewDuration / 60)}:{(interviewDuration % 60).toString().padStart(2, '0')}
                </span>
                {averageResponseTime > 0 && (
                  <>
                    <span>•</span>
                    <span>Avg: {averageResponseTime.toFixed(1)}s</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
