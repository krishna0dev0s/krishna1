"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ChevronDown, Code, FileJson, Zap, FileCode, Coffee, Hash,
    Mic, MicOff, Volume2, VolumeX, Pause, Play, RotateCcw, SkipForward, MessageSquare,
    Trophy, Globe2, BarChart3, Youtube, User, Timer
} from "lucide-react";
import { useDeepgram } from "@/hooks/use-deepgram";
import { generateSpeech, playAudio } from "@/lib/elevenlabs-client";
import { toast } from "sonner";

export default function LeetCodeSolver() {
	const [problem, setProblem] = useState("");
	const [language, setLanguage] = useState("JavaScript");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);
    const [code, setCode] = useState("// Write your solution here...\n");
    const [customTests, setCustomTests] = useState("// Enter custom input here\n");
    const [runResult, setRunResult] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const profileStats = {
        solved: 132,
        streak: 12,
        languages: {
            JavaScript: 48,
            Python: 42,
            "C++": 22,
            Java: 20,
        },
        weakTopics: ["Graphs", "DP", "Concurrency"],
    };

    const globalLeaderboard = [
        { rank: 1, user: "global_champ", country: "US", score: 9980, solved: 2400 },
        { rank: 2, user: "algoqueen", country: "IN", score: 9875, solved: 2302 },
        { rank: 3, user: "dp_master", country: "CN", score: 9760, solved: 2214 },
    ];

    const platformLeaderboard = [
        { rank: 1, user: "you", score: 320, solved: 38, success: 0.78 },
        { rank: 2, user: "dev_mate", score: 305, solved: 35, success: 0.74 },
        { rank: 3, user: "ai_runner", score: 290, solved: 33, success: 0.7 },
    ];

    const learningVideos = [
        { id: "1", title: "Two Sum in JS - Optimal", url: "https://www.youtube.com/watch?v=KLlXCFG5TnA", duration: "8:12" },
        { id: "2", title: "Binary Tree Level Order - Python", url: "https://www.youtube.com/watch?v=6ZnyEApgFYg", duration: "12:03" },
        { id: "3", title: "DP on Subsets - Java", url: "https://www.youtube.com/watch?v=3N0e_vXK2LI", duration: "15:44" },
    ];

    // Voice State
    const { 
        isListening: isDeepgramListening, 
        transcript: deepgramTranscript, 
        interimTranscript, 
        startDeepgram, 
        stopDeepgram, 
        clearTranscript 
    } = useDeepgram();

    const [isMicOn, setIsMicOn] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const [speechRate, setSpeechRate] = useState(1.0);
    const [autoSubmit, setAutoSubmit] = useState(true);
    const synthRef = useRef(null);
    const silenceTimeoutRef = useRef(null);

    // Initialize Speech Synthesis
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    // Sync Mic State
    useEffect(() => {
        if (!isDeepgramListening && isMicOn) {
            // Deepgram disconnected unexpectedly
        }
    }, [isDeepgramListening, isMicOn]);

    // Handle Voice Commands & Auto-Submit
    useEffect(() => {
        if (!deepgramTranscript) return;

        // Simple command parsing
        const lowerTranscript = deepgramTranscript.toLowerCase();
        
        // Check for "Problem X"
        const problemMatch = lowerTranscript.match(/problem\s+(\d+)/);
        if (problemMatch) {
            setProblem(problemMatch[1]);
            toast.success(`Detected Problem ${problemMatch[1]}`);
        }

        // Auto-submit logic (if silence for 2s)
        if (autoSubmit && deepgramTranscript.trim().length > 0) {
            if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
            
            silenceTimeoutRef.current = setTimeout(() => {
                if (problemMatch) {
                    submit();
                } else if (lowerTranscript.includes("submit") || lowerTranscript.includes("solve")) {
                    submit();
                }
            }, 2000);
        }
    }, [deepgramTranscript, autoSubmit]);

    // Speak Response Function (with Interrupt/Echo logic)
    const speakResponse = useCallback(async (text) => {
        setIsSpeaking(true);
        
        // Pause mic to prevent echo
        if (isMicOn) {
            setIsPaused(true);
            stopDeepgram();
        }

        try {
            // Try ElevenLabs first
            if (process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
                try {
                    const audioBuffer = await generateSpeech(text);
                    if (audioBuffer) {
                        await playAudio(audioBuffer);
                        setIsSpeaking(false);
                        if (isMicOn) {
                            setIsPaused(false);
                            setTimeout(() => startDeepgram(), 1500);
                        }
                        return;
                    }
                } catch (e) { console.log("ElevenLabs failed, using fallback"); }
            }

            // Fallback to Browser TTS
            if (synthRef.current) {
                synthRef.current.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = speechRate;
                utterance.volume = volume;
                
                utterance.onend = () => {
                    setIsSpeaking(false);
                    if (isMicOn) {
                        setIsPaused(false);
                        setTimeout(() => startDeepgram(), 1500);
                    }
                };
                
                synthRef.current.speak(utterance);
            }
        } catch (err) {
            console.error(err);
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, [isMicOn, speechRate, volume, startDeepgram, stopDeepgram]);

    // Toggle Mic (Interrupt Mode)
    const toggleMic = useCallback(async () => {
        if (isSpeaking) {
            // Interrupt AI
            if (synthRef.current) synthRef.current.cancel();
            setIsSpeaking(false);
            setTimeout(async () => {
                await startDeepgram();
                setIsMicOn(true);
                setIsPaused(false);
            }, 200);
        } else {
            if (isMicOn) {
                stopDeepgram();
                setIsMicOn(false);
            } else {
                await startDeepgram();
                setIsMicOn(true);
            }
        }
    }, [isSpeaking, isMicOn, startDeepgram, stopDeepgram]);

    // Stop Speaking Manually
    const stopSpeaking = useCallback(() => {
        if (synthRef.current) synthRef.current.cancel();
        setIsSpeaking(false);
        if (isPaused && isMicOn) {
            setIsPaused(false);
            startDeepgram();
        }
    }, [isPaused, isMicOn, startDeepgram]);

    // Run code via backend runner when available; fallback to stub
    const runCodeLocal = useCallback(async () => {
        try {
            const res = await fetch("/api/leetcode/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language, code, input: customTests }),
            });
            const data = await res.json();
            setRunResult({
                status: data?.status || "Ran (stub)",
                runtime: data?.runtime || `${50 + Math.floor(Math.random() * 30)} ms`,
                memory: data?.memory || `${(7 + Math.random() * 3).toFixed(1)} MB`,
                stdout: data?.stdout || "Sample output from your custom tests.",
                stderr: data?.stderr || "",
                timestamp: new Date().toISOString(),
                tests: customTests,
            });
            if (res.ok) {
                toast.success("Code executed via runner");
            } else {
                toast.info("Runner not configured; showing stub output");
            }
        } catch (err) {
            console.error(err);
            setRunResult({
                status: "Ran locally (simulated)",
                runtime: `${50 + Math.floor(Math.random() * 30)} ms`,
                memory: `${(7 + Math.random() * 3).toFixed(1)} MB`,
                stdout: "Sample output from your custom tests.",
                stderr: "",
                timestamp: new Date().toISOString(),
                tests: customTests,
            });
            toast.info("Runner unavailable; using stub output");
        }
    }, [language, code, customTests]);

    // Submit to backend proxy (falls back to stub if not configured)
    const submitToLeetCode = useCallback(async () => {
        try {
            setSubmissionStatus({ status: "Submitting...", verdict: "", runtime: "--", memory: "--", timestamp: new Date().toISOString() });
            const res = await fetch("/api/leetcode/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ problemNumber: problem, language, code }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message || "Submission failed (proxy not configured)");
            }
            const data = await res.json();
            setSubmissionStatus({
                status: data?.status || "Submitted",
                verdict: data?.verdict || "Pending",
                runtime: data?.runtime || "--",
                memory: data?.memory || "--",
                timestamp: new Date().toISOString(),
            });
            toast.success("Submission sent to LeetCode proxy");
        } catch (err) {
            console.error(err);
            setSubmissionStatus({
                status: "Submitted (stub)",
                verdict: "Accepted (simulated)",
                runtime: `${45 + Math.floor(Math.random() * 40)} ms`,
                memory: `${(8 + Math.random() * 4).toFixed(1)} MB`,
                timestamp: new Date().toISOString(),
            });
            toast.info("Submission simulated. Configure /api/leetcode/submit proxy for real results.");
        }
    }, [problem, language, code]);

	const submit = async (e) => {
		e?.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);
        
        // Speak "Thinking..."
        if (isMicOn) speakResponse("Let me think about that solution...");

		try {
			const res = await fetch("/api/leetcode", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ problemNumber: problem, language }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error || "Server error");
			setResult(json.data);

            // Speak the result summary
            if (isMicOn && json.data.approach) {
                // Summarize for speech (first 2 sentences)
                const summary = json.data.approach.split('.').slice(0, 2).join('.') + ".";
                speakResponse(`Here is the solution for ${json.data.title}. ${summary}`);
            }

		} catch (err) {
			setError(String(err));
            if (isMicOn) speakResponse("Sorry, I encountered an error fetching the solution.");
		} finally {
			setLoading(false);
		}
	};

    const editorLines = code.split('\n');

	return (
		<div className="max-w-5xl mx-auto">
			<div className="mb-12">
				<h1 className="text-5xl font-extrabold mb-3 tracking-tight">LeetCode Solver</h1>
				<p className="text-lg text-muted-foreground">Get AI-powered solutions for LeetCode problems with detailed explanations and code examples.</p>
			</div>

            {/* Voice Assistant Section */}
            <Card className="mb-8 bg-white/5 border-white/10">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Mic className="h-5 w-5 text-purple-400" />
                            Voice Assistant
                        </h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="autoSubmit"
                                checked={autoSubmit}
                                onChange={(e) => setAutoSubmit(e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="autoSubmit" className="text-sm text-gray-300 cursor-pointer">
                                Auto-submit
                            </label>
                        </div>
                    </div>

                    {/* Transcript Box */}
                    <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-4 bg-black/20 rounded-lg text-white border border-white/10 mb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Transcript
                        </div>
                        <div className="text-base">
                            {deepgramTranscript || interimTranscript ? (
                                <>
                                    <span className="text-white">{deepgramTranscript}</span>
                                    <span className="text-blue-400 italic ml-1">{interimTranscript}</span>
                                </>
                            ) : (
                                <span className="text-gray-500 italic">
                                    {isMicOn ? "Listening... Say 'Problem 1' or 'Solve Two Sum'" : "Click Start Mic to speak..."}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={toggleMic}
                                size="lg"
                                variant={isMicOn ? 'destructive' : 'default'}
                                className="gap-2"
                            >
                                {isMicOn ? <><MicOff className="h-5 w-5" /> Stop Mic</> : <><Mic className="h-5 w-5" /> Start Mic</>}
                            </Button>

                            {isSpeaking && (
                                <Button onClick={stopSpeaking} variant="outline" size="lg" className="gap-2 text-yellow-400">
                                    <VolumeX className="h-5 w-5" /> Stop AI
                                </Button>
                            )}
                            
                            <Button onClick={() => speakResponse(result?.approach || "No solution to read yet.")} variant="outline" size="icon" title="Read Solution">
                                <Volume2 className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-32">
                                <label className="text-xs text-gray-400 block mb-1">Speed: {speechRate}x</label>
                                <Slider value={[speechRate]} onValueChange={(v) => setSpeechRate(v[0])} min={0.5} max={2} step={0.1} />
                            </div>
                            <div className="w-32">
                                <label className="text-xs text-gray-400 block mb-1">Volume: {Math.round(volume * 100)}%</label>
                                <Slider value={[volume]} onValueChange={(v) => setVolume(v[0])} min={0} max={1} step={0.1} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

			<div className="border border-white/10 rounded-xl overflow-hidden">
				<div className="bg-gradient-to-r from-white/5 to-transparent p-8">
					<form onSubmit={submit} className="flex flex-col gap-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-semibold mb-3 tracking-wide">Problem Number</label>
								<Input
									id="problemNumber"
									type="number"
									value={problem}
									onChange={(e) => setProblem(e.target.value)}
									placeholder="e.g. 1, 2, 217..."
									className="border-white/20 h-11 rounded-lg focus:border-white/40 transition-colors w-full"
									required
								/>
								<p className="text-xs text-muted-foreground mt-2">Enter the LeetCode problem number</p>
							</div>

							<div>
								<label className="block text-sm font-semibold mb-3 tracking-wide">Programming Language</label>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline" size="sm" className="w-full justify-between h-11">
											<span>{language}</span>
											<ChevronDown className="h-4 w-4 ml-2" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-[240px]">
										<DropdownMenuItem onClick={() => setLanguage("JavaScript")} className="flex items-center gap-2">
											<Code className="h-4 w-4" />
											<span>JavaScript</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setLanguage("TypeScript")} className="flex items-center gap-2">
											<FileJson className="h-4 w-4" />
											<span>TypeScript</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setLanguage("Python")} className="flex items-center gap-2">
											<Zap className="h-4 w-4" />
											<span>Python</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setLanguage("Java")} className="flex items-center gap-2">
											<Coffee className="h-4 w-4" />
											<span>Java</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setLanguage("c++")} className="flex items-center gap-2">
											<Hash className="h-4 w-4" />
											<span>C++</span>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setLanguage("C#")} className="flex items-center gap-2">
											<Hash className="h-4 w-4" />
											<span>C#</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<p className="text-xs text-muted-foreground mt-2">Choose your preferred language</p>
							</div>
						</div>

						<Button
							type="submit"
							variant="secondary"
							size="lg"
							className="w-full sm:w-auto h-11 rounded-lg px-8 py-3 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(82,39,255,0.18)] text-white font-semibold tracking-wide"
							disabled={loading}
						>
							{loading ? (
								<>
									<span className="animate-spin mr-2">⏳</span>
									Generating...
								</>
							) : (
								"Get Solution"
							)}
						</Button>
					</form>
				</div>

                {/* Coding Workspace (LeetCode-style scaffold) */}
                <div className="p-8 border-t border-white/10 bg-black/30 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">LeetCode-style Workspace</p>
                            <h3 className="text-2xl font-bold text-white">Problem {problem || "—"}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Badge variant="outline" className="bg-white/10 text-white">Difficulty • {result?.difficulty || "—"}</Badge>
                            <Badge variant="outline" className="bg-white/10 text-white flex items-center gap-1"><Timer className="h-3 w-3" /> Runtime</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-300">
                                <span className="font-semibold">Editor ({language})</span>
                                <span className="text-xs">Line numbers, gutter, status bar</span>
                            </div>
                            <div className="rounded-lg border border-white/15 bg-[#0f172a] shadow-inner overflow-hidden">
                                <div className="flex">
                                    <div className="bg-[#0b1224] text-gray-500 text-xs font-mono px-3 py-3 select-none border-r border-white/10 leading-6">
                                        {editorLines.map((_, idx) => (
                                            <div key={idx}>{idx + 1}</div>
                                        ))}
                                    </div>
                                    <textarea
                                        spellCheck={false}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full min-h-[280px] resize-none bg-transparent text-sm font-mono text-gray-100 px-3 py-3 focus:outline-none caret-white leading-6"
                                        placeholder="// Write your solution here..."
                                        style={{ tabSize: 2 }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-gray-400 bg-[#0b1224] border-t border-white/10 px-3 py-2">
                                    <span>{language} • UTF-8 • LF</span>
                                    <span>Spaces: 2</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-300">
                                <span className="font-semibold">Custom Test Cases</span>
                                <span className="text-xs">Run locally against your input</span>
                            </div>
                            <Textarea
                                value={customTests}
                                onChange={(e) => setCustomTests(e.target.value)}
                                className="min-h-[180px] font-mono text-sm bg-black/40 border-white/20"
                                placeholder="Input goes here"
                            />
                            <div className="flex flex-wrap gap-3">
                                <Button type="button" onClick={runCodeLocal} size="sm" className="gap-2">
                                    <Play className="h-4 w-4" /> Run Code (local)
                                </Button>
                                <Button type="button" onClick={submitToLeetCode} variant="secondary" size="sm" className="gap-2">
                                    <FileCode className="h-4 w-4" /> Submit to LeetCode (stub)
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2 text-sm text-gray-300">
                                <span className="font-semibold flex items-center gap-2"><Play className="h-4 w-4" /> Run Result</span>
                                {runResult?.timestamp && <span className="text-xs">{new Date(runResult.timestamp).toLocaleTimeString()}</span>}
                            </div>
                            {runResult ? (
                                <div className="space-y-1 text-sm text-gray-200">
                                    <div className="flex gap-2"><Badge variant="outline">{runResult.status}</Badge></div>
                                    <div>Runtime: {runResult.runtime} • Memory: {runResult.memory}</div>
                                    <div className="text-green-300">Stdout: {runResult.stdout}</div>
                                    {runResult.stderr && <div className="text-red-300">Stderr: {runResult.stderr}</div>}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">Run your code to see output.</p>
                            )}
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2 text-sm text-gray-300">
                                <span className="font-semibold flex items-center gap-2"><FileCode className="h-4 w-4" /> Submission</span>
                                {submissionStatus?.timestamp && <span className="text-xs">{new Date(submissionStatus.timestamp).toLocaleTimeString()}</span>}
                            </div>
                            {submissionStatus ? (
                                <div className="space-y-1 text-sm text-gray-200">
                                    <div className="flex gap-2"><Badge variant="outline">{submissionStatus.verdict}</Badge></div>
                                    <div>Status: {submissionStatus.status}</div>
                                    <div>Runtime: {submissionStatus.runtime} • Memory: {submissionStatus.memory}</div>
                                    <p className="text-xs text-gray-400">Real submissions require backend automation with LeetCode auth.</p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">Submit to see verdict and stats.</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-300 font-semibold"><Globe2 className="h-4 w-4" /> Global Leaderboard</div>
                            <div className="space-y-2 text-sm text-gray-200">
                                {globalLeaderboard.map(entry => (
                                    <div key={entry.rank} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                                        <span className="flex items-center gap-2"><Badge variant="outline">#{entry.rank}</Badge> {entry.user}</span>
                                        <span className="text-xs text-gray-400">Score {entry.score} • Solved {entry.solved}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-300 font-semibold"><Trophy className="h-4 w-4" /> Platform Leaderboard</div>
                            <div className="space-y-2 text-sm text-gray-200">
                                {platformLeaderboard.map(entry => (
                                    <div key={entry.rank} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                                        <span className="flex items-center gap-2"><Badge variant="outline">#{entry.rank}</Badge> {entry.user}</span>
                                        <span className="text-xs text-gray-400">Solved {entry.solved} • Success {(entry.success * 100).toFixed(0)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 mb-2 text-sm text-gray-300 font-semibold"><BarChart3 className="h-4 w-4" /> Profile Snapshot</div>
                            <div className="text-sm text-gray-200 space-y-1">
                                <div>Solved: {profileStats.solved}</div>
                                <div>Streak: {profileStats.streak} days</div>
                                <div className="text-xs text-gray-400">Weak topics: {profileStats.weakTopics.join(', ')}</div>
                                <div className="text-xs text-gray-400">Lang mix: {Object.entries(profileStats.languages).map(([k,v]) => `${k} ${v}`).join(' • ')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-300 font-semibold"><Youtube className="h-4 w-4" /> Learning Videos</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-200">
                            {learningVideos.map(video => (
                                <a key={video.id} href={video.url} target="_blank" rel="noreferrer" className="block bg-white/5 rounded-lg p-3 border border-white/10 hover:border-white/40 transition-colors">
                                    <div className="font-semibold mb-1 flex items-center gap-2"><Youtube className="h-4 w-4 text-red-400" /> {video.title}</div>
                                    <div className="text-xs text-gray-400">Duration: {video.duration}</div>
                                    <div className="text-xs text-gray-500">Prefers high-rated sources • Progress tracking TBD</div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

				{error && (
					<div className="p-6 bg-red-500/10 border-t border-white/10">
						<p className="text-red-400 font-medium">⚠️ {error}</p>
					</div>
				)}

				{result && (
					<div className="p-8 space-y-8">
						<div className="border-b border-white/10 pb-6">
							<div className="flex items-center justify-between mb-3">
								<h2 className="text-3xl font-bold tracking-tight">{result.title}</h2>
								<span className="px-4 py-2 rounded-full bg-white/10 text-sm font-semibold">
									{result.difficulty}
								</span>
							</div>
							<p className="text-muted-foreground">Problem Solution & Explanation</p>
						</div>

						{result.description && (
							<div className="rounded-lg bg-white/5 p-6 border border-white/10">
								<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
									<span className="text-xl">📝</span> Problem Description
								</h3>
								<div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.description}</div>
							</div>
						)}

						{result.approach && (
							<div className="rounded-lg bg-white/5 p-6 border border-white/10">
								<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
									<span className="text-xl">💡</span> Approach
								</h3>
								<div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{result.approach}</div>
							</div>
						)}

						{result.steps && Array.isArray(result.steps) && (
							<div className="rounded-lg bg-white/5 p-6 border border-white/10">
								<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
									<span className="text-xl">🎯</span> Steps
								</h3>
								<ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
									{result.steps.map((s, i) => (
										<li key={i} className="leading-relaxed">{s}</li>
									))}
								</ol>
							</div>
						)}

						<div className="rounded-lg bg-white/5 p-6 border border-white/10">
							<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
								<span className="text-xl">💻</span> Code Solution
							</h3>
							<Textarea
								readOnly
								value={result.code || JSON.stringify(result, null, 2)}
								className="font-mono min-h-[300px] text-xs bg-black/40 border-white/20 rounded-lg p-4 leading-relaxed"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
