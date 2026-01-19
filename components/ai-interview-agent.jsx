"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  generateAcknowledgment,
  generateFollowUp,
  analyzeAnswerLength,
  detectAnswerType,
  getEmpathyPhrase,
} from "@/lib/interview-helpers";

/**
 * AI Interview Agent Component
 * Conducts professional, human-like interviews following a structured flow
 */
export default function AIInterviewAgent({ role, level = "Mid", onComplete }) {
  // State Management
  const [stage, setStage] = useState("introduction"); // introduction, warmup, questions, closing
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Question Pool based on role
  const questionPool = generateQuestionsForRole(role, level);
  const currentQuestion = questionPool[questionIndex];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + transcriptSegment + " ");
          } else {
            interimTranscript += transcriptSegment;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== "no-speech") {
          toast.error("Microphone issue: " + event.error);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Text-to-Speech function with better voice control
  const speakText = useCallback((text) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Slightly slower for natural speech
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => {
        console.warn("Speech synthesis error");
        setIsAiSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  }, []);

  // AI Response generation with context
  const generateAiResponse = useCallback(
    async (userInput, currentStage, includeFollowUp = false) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/interview-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role,
            level,
            stage: currentStage,
            userInput,
            questionIndex,
            previousAnswers: answers,
            includeFollowUp,
          }),
        });

        if (!res.ok) throw new Error("Failed to generate response");

        const data = await res.json();
        setAiResponse(data.response);
        speakText(data.response);

        // Add to conversation history
        if (userInput) {
          setConversationHistory((prev) => [
            ...prev,
            { role: "candidate", content: userInput },
            { role: "interviewer", content: data.response },
          ]);
        }

        return data;
      } catch (error) {
        console.error("Error generating AI response:", error);
        toast.error("Failed to generate response");
      } finally {
        setIsLoading(false);
      }
    },
    [role, level, questionIndex, answers, speakText]
  );

  // Start/Stop Listening
  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  // Handle Answer Submission with natural flow
  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      toast.error("Please say something before submitting");
      return;
    }

    // Store answer
    const newAnswers = [...answers, { question: currentQuestion, answer: transcript }];
    setAnswers(newAnswers);

    // Generate AI acknowledgment and follow-up
    await generateAiResponse(transcript, "questions", true);

    // Move to next question or closing with slight delay for natural feel
    if (questionIndex < questionPool.length - 1) {
      setTimeout(() => {
        setQuestionIndex(questionIndex + 1);
        setTranscript("");
      }, 2500);
    } else {
      setTimeout(() => {
        setStage("closing");
        generateAiResponse("", "closing");
      }, 2500);
    }
  };

  // Handle Introduction Stage
  const handleIntroductionComplete = async () => {
    setStage("warmup");
    await generateAiResponse("", "introduction");
  };

  // Handle Warmup Response
  const handleWarmupComplete = async () => {
    setStage("questions");
    await generateAiResponse(transcript, "warmup");
    setTimeout(() => {
      setTranscript("");
    }, 1000);
  };

  // Restart Interview
  const restartInterview = () => {
    setStage("introduction");
    setQuestionIndex(0);
    setAnswers([]);
    setTranscript("");
    setAiResponse("");
    setConversationHistory([]);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Interview Session</h1>
              <p className="text-gray-400">
                Role: <Badge className="ml-2">{role}</Badge>
                <Badge className="ml-2" variant="outline">{level} Level</Badge>
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Introduction Stage */}
          {stage === "introduction" && (
            <motion.div
              key="introduction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle>Welcome to Your Interview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      You're about to have a conversation with your AI interviewer for the <strong>{role}</strong> position at <strong>{level}</strong> level.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-blue-300">What to expect:</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Warm, conversational greeting to help you relax</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>A few warm-up questions to get comfortable</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Role-specific and behavioral questions</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Natural follow-ups based on your answers</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>Time for your questions at the end</span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-gray-400 text-sm">
                      💡 <strong>Pro tip:</strong> Speak naturally and clearly. Take your time thinking through answers.
                    </p>
                  </div>

                  <Button
                    onClick={handleIntroductionComplete}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Begin Interview
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Warmup Stage */}
          {stage === "warmup" && (
            <motion.div
              key="warmup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle>Getting to Know You</CardTitle>
                  <p className="text-gray-400 mt-2">Let's start with something casual to help you get comfortable</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Response Display - Question */}
                  {!aiResponse && !isLoading && (
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 space-y-3 animate-pulse">
                      <p className="text-sm font-semibold text-gray-300">Waiting for interviewer...</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                        <p className="text-sm font-semibold text-gray-300">Thinking...</p>
                      </div>
                    </div>
                  )}

                  {aiResponse && (
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isAiSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                        <p className="text-sm font-semibold text-gray-300">Interviewer</p>
                      </div>
                      <p className="text-gray-200 leading-relaxed text-lg">{aiResponse}</p>
                    </div>
                  )}

                  {/* User Response Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-300">Your Response</label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Share your response here..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                    />
                  </div>

                  {/* Audio Controls */}
                  <div className="flex gap-3">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      className="flex-1 gap-2"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleWarmupComplete}
                    disabled={!transcript.trim() || isLoading}
                    size="lg"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit & Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Questions Stage */}
          {stage === "questions" && currentQuestion && (
            <motion.div
              key={`question-${questionIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">
                      Question {questionIndex + 1} of {questionPool.length}
                    </Badge>
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                        style={{ width: `${((questionIndex + 1) / questionPool.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
                  <p className="text-gray-400 mt-3">
                    <span className="inline-block">📁 {currentQuestion.category}</span>
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* AI Response Display */}
                  {isLoading && (
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                        <p className="text-sm font-semibold text-gray-300">Listening to your answer...</p>
                      </div>
                    </div>
                  )}

                  {aiResponse && !isLoading && (
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isAiSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                        <p className="text-sm font-semibold text-gray-300">Interviewer's Response</p>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{aiResponse}</p>
                    </div>
                  )}

                  {/* User Response Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-300">Your Answer</label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Speak or type your answer here..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
                    />
                    <p className="text-xs text-gray-500">{transcript.length} characters</p>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex gap-3">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      className="flex-1 gap-2"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!transcript.trim() || isLoading}
                    size="lg"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {questionIndex === questionPool.length - 1 ? "Finish Interview" : "Next Question"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Closing Stage */}
          {stage === "closing" && (
            <motion.div
              key="closing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle>Interview Complete</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Closing Message */}
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 space-y-4">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" />
                        <p className="text-sm font-semibold text-gray-300">Preparing closing thoughts...</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-lg text-gray-200 leading-relaxed">
                          {aiResponse ||
                            "Thanks for taking the time to interview with me today. Do you have any questions for me?"}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Interview Summary */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-white">Interview Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Questions Answered</p>
                        <p className="text-2xl font-bold text-white">{answers.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Role</p>
                        <p className="text-xl font-semibold text-white">{role}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Level</p>
                        <p className="text-xl font-semibold text-white">{level}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Duration</p>
                        <p className="text-xl font-semibold text-white">~{Math.round(answers.length * 3)} min</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        if (onComplete) onComplete(answers);
                      }}
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      Get Feedback
                    </Button>
                    <Button onClick={restartInterview} variant="outline" size="lg" className="flex-1 gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 text-xs text-gray-500 space-y-1"
        >
          {isListening && (
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Recording...</span>
            </div>
          )}
          {isAiSpeaking && (
            <div className="flex items-center gap-2 text-blue-400">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Speaking...</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

  // Question Pool based on role
  const questionPool = generateQuestionsForRole(role, level);
  const currentQuestion = questionPool[questionIndex];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + transcriptSegment + " ");
          } else {
            interimTranscript += transcriptSegment;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        toast.error("Microphone error: " + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Text-to-Speech function
  const speakText = useCallback((text) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  }, []);

  // AI Response generation
  const generateAiResponse = useCallback(async (userInput, currentStage) => {
    try {
      const res = await fetch("/api/interview-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          level,
          stage: currentStage,
          userInput,
          questionIndex: questionIndex,
          previousAnswers: answers,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate response");

      const data = await res.json();
      setAiResponse(data.response);
      speakText(data.response);

      return data;
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast.error("Failed to generate response");
    }
  }, [role, level, questionIndex, answers, speakText]);

  // Start/Stop Listening
  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Handle Answer Submission
  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) {
      toast.error("Please say something before submitting");
      return;
    }

    // Store answer
    setAnswers([...answers, { question: currentQuestion, answer: transcript }]);

    // Generate AI response
    const response = await generateAiResponse(transcript, "questions");

    // Move to next question or closing
    if (questionIndex < questionPool.length - 1) {
      setTimeout(() => {
        setQuestionIndex(questionIndex + 1);
        setTranscript("");
      }, 3000);
    } else {
      setStage("closing");
      generateAiResponse("", "closing");
    }
  };

  // Handle Introduction Stage
  const handleIntroductionComplete = async () => {
    setStage("warmup");
    await generateAiResponse("", "introduction");
  };

  // Handle Warmup Response
  const handleWarmupComplete = async () => {
    setStage("questions");
    await generateAiResponse(transcript, "warmup");
  };

  // Copy feedback to clipboard
  const copyFeedback = () => {
    if (feedback) {
      navigator.clipboard.writeText(JSON.stringify(feedback, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Feedback copied!");
    }
  };

  // Restart Interview
  const restartInterview = () => {
    setStage("introduction");
    setQuestionIndex(0);
    setAnswers([]);
    setTranscript("");
    setAiResponse("");
    setFeedback(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">AI Interview Session</h1>
              <p className="text-gray-400">
                Role: <Badge className="ml-2">{role}</Badge>
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Introduction Stage */}
          {stage === "introduction" && (
            <motion.div
              key="introduction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle>Welcome to Your Interview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Hi there! Thanks for joining today. I'm your AI interview assistant, and I'll be conducting a professional interview for the <strong>{role}</strong> position.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-blue-300">Interview Format:</h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex gap-2">
                          <span>1.</span>
                          <span>I'll greet you and explain the format</span>
                        </li>
                        <li className="flex gap-2">
                          <span>2.</span>
                          <span>We'll start with a warm-up question to help you relax</span>
                        </li>
                        <li className="flex gap-2">
                          <span>3.</span>
                          <span>I'll ask role-specific and behavioral questions</span>
                        </li>
                        <li className="flex gap-2">
                          <span>4.</span>
                          <span>We'll wrap up, and you can ask me questions</span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-gray-400 text-sm">
                      💡 <strong>Tip:</strong> Speak naturally and clearly. Use the microphone button to record your answers.
                    </p>
                  </div>

                  <Button
                    onClick={handleIntroductionComplete}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Start Interview
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Warmup Stage */}
          {stage === "warmup" && (
            <motion.div
              key="warmup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle>Warm-up Question</CardTitle>
                  <p className="text-gray-400 mt-2">Let's start with something light to get you comfortable</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* AI Response Display */}
                  {aiResponse && (
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isAiSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                        <p className="text-sm font-semibold text-gray-300">Interviewer</p>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{aiResponse}</p>
                    </div>
                  )}

                  {/* User Response Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-300">Your Response</label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Speak your answer or type it here..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  {/* Audio Controls */}
                  <div className="flex gap-3">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      className="flex-1 gap-2"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleWarmupComplete}
                    disabled={!transcript.trim()}
                    size="lg"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit & Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Questions Stage */}
          {stage === "questions" && currentQuestion && (
            <motion.div
              key={`question-${questionIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">
                      Question {questionIndex + 1} of {questionPool.length}
                    </Badge>
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                        style={{ width: `${((questionIndex + 1) / questionPool.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
                  <p className="text-gray-400 mt-3">Category: {currentQuestion.category}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* AI Response Display */}
                  {aiResponse && (
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isAiSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-500"}`} />
                        <p className="text-sm font-semibold text-gray-300">Interviewer's Thought</p>
                      </div>
                      <p className="text-gray-200 leading-relaxed italic">{aiResponse}</p>
                    </div>
                  )}

                  {/* User Response Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-300">Your Answer</label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Speak or type your answer here..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                    <p className="text-xs text-gray-500">{transcript.length} characters</p>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex gap-3">
                    <Button
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      className="flex-1 gap-2"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!transcript.trim()}
                    size="lg"
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {questionIndex === questionPool.length - 1 ? "Finish Interview" : "Next Question"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Closing Stage */}
          {stage === "closing" && (
            <motion.div
              key="closing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-white/10">
                <CardHeader>
                  <CardTitle>Interview Complete</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Closing Message */}
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 space-y-4">
                    <p className="text-lg text-gray-200 leading-relaxed">
                      {aiResponse || "Thank you for your time today! That was an excellent interview. You demonstrated strong technical knowledge and excellent communication skills."}
                    </p>

                    <p className="text-gray-400">
                      Do you have any questions for me about the role or the company?
                    </p>
                  </div>

                  {/* Final Questions Input */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-300">Your Questions (Optional)</label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Ask any questions about the role or company..."
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>

                  {/* Interview Summary */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-white">Interview Summary</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>✓ Completed {answers.length} questions</p>
                      <p>✓ Role: {role}</p>
                      <p>✓ Level: {level}</p>
                      <p>✓ Duration: ~{Math.round(answers.length * 3)} minutes</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        if (onComplete) onComplete(answers);
                      }}
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      Get Feedback
                    </Button>
                    <Button
                      onClick={restartInterview}
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Restart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 text-xs text-gray-500"
        >
          {isListening && <span className="text-green-400">🎤 Recording...</span>}
          {isAiSpeaking && <span className="text-blue-400">🔊 Speaking...</span>}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Generate role-specific questions
 */
function generateQuestionsForRole(role, level) {
  const questions = {
    "Software Engineer": [
      {
        question: "Can you walk me through a complex project where you solved a challenging coding problem?",
        category: "Technical Knowledge",
        type: "behavioral",
      },
      {
        question: "How do you approach debugging a difficult issue in production?",
        category: "Problem Solving",
        type: "technical",
      },
      {
        question: "Tell me about a time you had to refactor legacy code. What was your approach?",
        category: "Technical Knowledge",
        type: "behavioral",
      },
      {
        question: "How do you stay updated with new technologies and best practices?",
        category: "Learning & Growth",
        type: "behavioral",
      },
      {
        question: "Describe a situation where you had to work with a difficult team member. How did you handle it?",
        category: "Communication & Teamwork",
        type: "behavioral",
      },
    ],
    "Product Manager": [
      {
        question: "How do you approach prioritizing features when stakeholders have conflicting needs?",
        category: "Decision Making",
        type: "situational",
      },
      {
        question: "Tell me about a product launch you led. What was the outcome?",
        category: "Leadership",
        type: "behavioral",
      },
      {
        question: "How do you measure the success of a feature you've shipped?",
        category: "Metrics & Analytics",
        type: "technical",
      },
      {
        question: "Describe a time you had to pivot your product strategy. What triggered the change?",
        category: "Adaptability",
        type: "behavioral",
      },
      {
        question: "How do you balance technical feasibility with business goals?",
        category: "Strategic Thinking",
        type: "situational",
      },
    ],
    "Designer": [
      {
        question: "Can you walk me through your design process from concept to final delivery?",
        category: "Methodology",
        type: "behavioral",
      },
      {
        question: "Tell me about a design challenge you overcame and how you solved it.",
        category: "Problem Solving",
        type: "behavioral",
      },
      {
        question: "How do you incorporate user feedback into your design iterations?",
        category: "User Research",
        type: "technical",
      },
      {
        question: "Describe your approach to creating accessible and inclusive designs.",
        category: "Accessibility",
        type: "technical",
      },
      {
        question: "How do you collaborate with developers to ensure your designs are implemented correctly?",
        category: "Communication & Teamwork",
        type: "behavioral",
      },
    ],
    "Sales Executive": [
      {
        question: "How do you build trust with new clients and close deals effectively?",
        category: "Relationship Building",
        type: "behavioral",
      },
      {
        question: "Tell me about your most successful sales achievement and what led to it.",
        category: "Achievement",
        type: "behavioral",
      },
      {
        question: "How do you handle rejection or when a prospect says no?",
        category: "Resilience",
        type: "situational",
      },
      {
        question: "Describe your approach to understanding customer pain points and needs.",
        category: "Customer Understanding",
        type: "technical",
      },
      {
        question: "How do you stay motivated and manage your pipeline during slow periods?",
        category: "Self-Management",
        type: "behavioral",
      },
    ],
    "Data Scientist": [
      {
        question: "Tell me about a machine learning project where you had to make critical decisions about data or model selection.",
        category: "Technical Knowledge",
        type: "behavioral",
      },
      {
        question: "How do you approach feature engineering for a new problem?",
        category: "Problem Solving",
        type: "technical",
      },
      {
        question: "Describe a time when your model performed poorly in production. What did you do?",
        category: "Debugging & Troubleshooting",
        type: "behavioral",
      },
      {
        question: "How do you communicate complex statistical findings to non-technical stakeholders?",
        category: "Communication",
        type: "behavioral",
      },
      {
        question: "What's your approach to ensuring data quality and preventing biases in your models?",
        category: "Ethics & Quality",
        type: "technical",
      },
    ],
  };

  return questions[role] || questions["Software Engineer"];
}
