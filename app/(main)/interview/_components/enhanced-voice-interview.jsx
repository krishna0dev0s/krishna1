'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, ChevronLeft, 
  Download, Zap, MessageSquare, RefreshCw, Settings,
  CheckCircle2, XCircle, Loader2, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Enhanced Voice Interview - Completely Rebuilt
 * Features: Robust recognition, Real-time feedback, Enhanced UX
 */
export default function EnhancedVoiceInterview({ company, job, onBack, onComplete }) {
  // Core States
  const [isMicActive, setIsMicActive] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Transcript States
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  // Conversation States
  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState('introduction');
  const [questionCount, setQuestionCount] = useState(0);
  
  // Audio States
  const [audioLevel, setAudioLevel] = useState(0);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  
  // Settings
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [submitDelay, setSubmitDelay] = useState(3);
  
  // Analytics
  const [stats, setStats] = useState({
    wordsSpoken: 0,
    averageConfidence: 0,
    responseTime: 0,
    questionsAnswered: 0
  });
  
  // Refs
  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const synthRef = useRef(null);
  const messagesEndRef = useRef(null);
  const responseStartTimeRef = useRef(null);
  
  // Initialize Speech Recognition
  useEffect(() => {
    console.log('🎤 Initializing Enhanced Voice Interview...');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Speech Recognition not supported. Use Chrome, Edge, or Safari.');
      return;
    }
    
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      // Event Handlers
      recognition.onstart = () => {
        console.log('✅ Recognition started');
        setIsRecognizing(true);
        responseStartTimeRef.current = Date.now();
      };
      
      recognition.onaudiostart = () => {
        console.log('🔊 Audio detected');
      };
      
      recognition.onspeechstart = () => {
        console.log('💬 Speech detected');
      };
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += text + ' ';
            const conf = result[0].confidence || 0.9;
            setConfidence(Math.round(conf * 100));
            console.log(`✅ Final: "${text}" (${Math.round(conf * 100)}%)`);
          } else {
            interimTranscript += text;
            console.log(`⏳ Interim: "${text}"`);
          }
        }
        
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
          
          // Reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          
          // Auto-submit after silence
          if (autoSubmit) {
            silenceTimerRef.current = setTimeout(() => {
              handleSubmit();
            }, submitDelay * 1000);
          }
        }
        
        setInterimText(interimTranscript);
      };
      
      recognition.onend = () => {
        console.log('🛑 Recognition ended');
        setIsRecognizing(false);
        
        // Auto-restart if mic is active
        if (isMicActive && !isSpeaking) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 100);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('❌ Recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          console.log('⚠️ No speech detected');
        } else if (event.error === 'audio-capture') {
          toast.error('Cannot access microphone');
          setIsMicActive(false);
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied');
          setIsMicActive(false);
        } else if (event.error !== 'aborted') {
          toast.error(`Recognition error: ${event.error}`);
        }
      };
      
      recognitionRef.current = recognition;
      console.log('✅ Speech Recognition initialized');
      
    } catch (error) {
      console.error('Failed to initialize recognition:', error);
      toast.error('Failed to setup voice recognition');
    }
    
    // Initialize Speech Synthesis
    if (window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      console.log('✅ Speech Synthesis initialized');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);
  
  // Start interview on mount
  useEffect(() => {
    if (messages.length === 0) {
      startInterview();
    }
  }, []);
  
  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initialize audio visualization
  const initAudioVisualization = useCallback((stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const visualize = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(Math.min(100, average * 1.5));
        animationFrameRef.current = requestAnimationFrame(visualize);
      };
      
      visualize();
    } catch (error) {
      console.error('Audio visualization error:', error);
    }
  }, []);
  
  // Toggle Microphone
  const toggleMicrophone = async () => {
    if (isMicActive) {
      // Stop microphone
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      setIsMicActive(false);
      setIsRecognizing(false);
      setAudioLevel(0);
      toast.info('🎤 Microphone OFF');
      
    } else {
      // Start microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100
          }
        });
        
        mediaStreamRef.current = stream;
        initAudioVisualization(stream);
        
        // Start recognition
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
        
        setIsMicActive(true);
        toast.success('🎤 Microphone ON - Speak clearly!');
        
      } catch (error) {
        console.error('Microphone error:', error);
        
        if (error.name === 'NotAllowedError') {
          toast.error('❌ Microphone permission denied');
        } else if (error.name === 'NotFoundError') {
          toast.error('❌ No microphone found');
        } else {
          toast.error('❌ Cannot access microphone');
        }
      }
    }
  };
  
  // Start Interview
  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/interview/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: 'start',
          company: company,
          jobTitle: job?.title || job,
          conversationHistory: []
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const greeting = {
          role: 'interviewer',
          content: data.response,
          timestamp: new Date().toISOString()
        };
        
        setMessages([greeting]);
        setPhase(data.phase || 'introduction');
        
        // Speak greeting
        setTimeout(() => speakText(data.response), 500);
      }
    } catch (error) {
      console.error('Start error:', error);
      toast.error('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };
  
  // Submit Answer
  const handleSubmit = async () => {
    const answer = transcript.trim();
    
    if (!answer) {
      toast.error('Please speak your answer first');
      return;
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    
    setLoading(true);
    
    // Calculate response time
    const responseTime = responseStartTimeRef.current 
      ? (Date.now() - responseStartTimeRef.current) / 1000 
      : 0;
    
    // Add user message
    const userMessage = {
      role: 'candidate',
      content: answer,
      timestamp: new Date().toISOString(),
      confidence: confidence,
      responseTime: responseTime
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Update stats
    const words = answer.split(/\s+/).length;
    setStats(prev => ({
      wordsSpoken: prev.wordsSpoken + words,
      averageConfidence: prev.averageConfidence === 0 
        ? confidence 
        : (prev.averageConfidence + confidence) / 2,
      responseTime: prev.responseTime === 0
        ? responseTime
        : (prev.responseTime + responseTime) / 2,
      questionsAnswered: prev.questionsAnswered + 1
    }));
    
    // Clear transcript
    setTranscript('');
    setInterimText('');
    setConfidence(0);
    
    try {
      const response = await fetch('/api/interview/ai-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase: phase,
          company: company,
          jobTitle: job?.title || job,
          userResponse: answer,
          conversationHistory: updatedMessages
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const aiMessage = {
          role: 'interviewer',
          content: data.response,
          timestamp: new Date().toISOString()
        };
        
        setMessages([...updatedMessages, aiMessage]);
        setPhase(data.phase || phase);
        setQuestionCount(prev => prev + 1);
        
        // Check if interview should end
        if (!data.shouldContinue || questionCount >= 10) {
          setTimeout(() => endInterview([...updatedMessages, aiMessage]), 5000);
        } else {
          // Speak AI response
          setTimeout(() => speakText(data.response), 300);
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to process answer');
    } finally {
      setLoading(false);
    }
  };
  
  // Text-to-Speech
  const speakText = (text) => {
    if (!synthRef.current) return;
    
    setIsSpeaking(true);
    
    // Pause recognition while speaking
    if (isMicActive && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = volume;
    
    // Get best voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Enhanced') ||
      v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
      
      // Resume recognition
      if (isMicActive && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {}
        }, 500);
      }
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    synthRef.current.speak(utterance);
  };
  
  // Stop Speaking
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };
  
  // Clear Transcript
  const clearTranscript = () => {
    setTranscript('');
    setInterimText('');
    setConfidence(0);
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    toast.info('Transcript cleared');
  };
  
  // End Interview
  const endInterview = (finalMessages) => {
    if (onComplete) {
      onComplete({
        messages: finalMessages,
        stats: stats,
        company: company,
        job: job
      });
    }
    toast.success('Interview completed!');
  };
  
  // Download Transcript
  const downloadTranscript = () => {
    const content = messages.map(msg => {
      const role = msg.role === 'interviewer' ? 'INTERVIEWER' : 'YOU';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      return `[${time}] ${role}: ${msg.content}`;
    }).join('\n\n');
    
    const blob = new Blob([
      `VOICE INTERVIEW TRANSCRIPT\n`,
      `Company: ${company}\n`,
      `Position: ${job?.title || job}\n`,
      `Date: ${new Date().toLocaleDateString()}\n`,
      `\n${'='.repeat(50)}\n\n`,
      content
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${company}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Transcript downloaded!');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Voice Interview</h1>
            <p className="text-sm text-gray-300">{company} - {job?.title || job}</p>
          </div>
          
          <Button
            onClick={downloadTranscript}
            variant="outline"
            disabled={messages.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Conversation */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversation
                  <Badge variant="outline" className="ml-auto">
                    Question {questionCount + 1}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] overflow-y-auto space-y-4 pr-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'candidate'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          {msg.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {msg.confidence}% confident
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
            </Card>
            
            {/* Your Response */}
            <Card className="bg-black/40 border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Your Response:</span>
                  <div className="flex items-center gap-2">
                    {confidence > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {confidence}% confident
                      </Badge>
                    )}
                    {transcript && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearTranscript}
                        className="h-6 px-2"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="min-h-[100px] p-4 bg-black/30 rounded-lg border border-white/10">
                  <p className="text-white font-medium leading-relaxed">
                    {transcript}
                    {interimText && (
                      <span className="text-blue-400 italic ml-1">{interimText}</span>
                    )}
                    {!transcript && !interimText && (
                      <span className="text-gray-500 italic">
                        {isMicActive 
                          ? '🎤 Listening... speak now!' 
                          : 'Click "Start Mic" to begin speaking'}
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Controls */}
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={toggleMicrophone}
                    size="lg"
                    variant={isMicActive ? 'destructive' : 'default'}
                    className="gap-2"
                  >
                    {isMicActive ? (
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
                  
                  {transcript.length > 0 && !loading && (
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-5 w-5" />
                      Send Answer
                    </Button>
                  )}
                  
                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      <VolumeX className="h-5 w-5" />
                      Stop AI
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="checkbox"
                      id="autoSubmit"
                      checked={autoSubmit}
                      onChange={(e) => setAutoSubmit(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="autoSubmit" className="text-sm text-gray-300 cursor-pointer">
                      Auto-submit ({submitDelay}s)
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Side Panel */}
          <div className="space-y-4">
            {/* Status */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Microphone</span>
                  {isMicActive ? (
                    <Badge className="bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="h-3 w-3 mr-1" />
                      Off
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Recognition</span>
                  {isRecognizing ? (
                    <Badge className="bg-blue-600">
                      <Zap className="h-3 w-3 mr-1" />
                      Listening
                    </Badge>
                  ) : (
                    <Badge variant="outline">Idle</Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">AI Speaking</span>
                  {isSpeaking ? (
                    <Badge className="bg-purple-600">
                      <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
                      Speaking
                    </Badge>
                  ) : (
                    <Badge variant="outline">Silent</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Audio Level */}
            {isMicActive && (
              <Card className="bg-black/40 border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Audio Level</span>
                    <span className="text-xs text-white">{Math.round(audioLevel)}%</span>
                  </div>
                  <Progress value={audioLevel} className="h-2" />
                  
                  {isRecognizing && (
                    <div className="flex items-center gap-1 mt-3">
                      <div className="w-1 h-4 bg-red-500 animate-pulse rounded"></div>
                      <div className="w-1 h-6 bg-red-500 animate-pulse rounded" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-5 bg-red-500 animate-pulse rounded" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-xs text-red-400 ml-2">Recording...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Voice Controls */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Voice Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-400">Speech Rate</label>
                    <span className="text-xs text-white">{speechRate.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[speechRate]}
                    onValueChange={([value]) => setSpeechRate(value)}
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
                    onValueChange={([value]) => setVolume(value)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-400">Auto-submit Delay</label>
                    <span className="text-xs text-white">{submitDelay}s</span>
                  </div>
                  <Slider
                    value={[submitDelay]}
                    onValueChange={([value]) => setSubmitDelay(value)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Stats */}
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">Interview Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Questions Answered</span>
                  <span className="font-bold text-white">{stats.questionsAnswered}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Words Spoken</span>
                  <span className="font-bold text-white">{stats.wordsSpoken}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Avg Confidence</span>
                  <span className="font-bold text-white">{Math.round(stats.averageConfidence)}%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Avg Response Time</span>
                  <span className="font-bold text-white">{stats.responseTime.toFixed(1)}s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
