"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LANGUAGES = ["JavaScript", "Python", "C++", "Java", "TypeScript", "Go"];

export default function LeetCodeSolver() {
    const [problemNumber, setProblemNumber] = useState("");
    const [language, setLanguage] = useState("JavaScript");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const submit = async (event) => {
        event?.preventDefault();
        if (!problemNumber.trim()) {
            setError("Please enter a problem number.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/leetcode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemNumber: problemNumber.trim(),
                    language,
                    description: description.trim(),
                }),
            });

            const json = await res.json();
            if (!res.ok || !json?.success) {
                throw new Error(json?.error || "Failed to fetch solution.");
            }

            setResult(json.data);
        } catch (err) {
            setError(String(err.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">LeetCode Solver</h1>
                <p className="text-muted-foreground">
                    Enter a problem number and get a focused solution outline and code.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Request a solution</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={submit}>
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium">Problem number</label>
                                <Input
                                    value={problemNumber}
                                    onChange={(event) => setProblemNumber(event.target.value)}
                                    placeholder="e.g. 1"
                                    inputMode="numeric"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Language</label>
                                <select
                                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    value={language}
                                    onChange={(event) => setLanguage(event.target.value)}
                                >
                                    {LANGUAGES.map((lang) => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Optional description</label>
                            <Textarea
                                rows={4}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Paste a short description if you want a tailored response."
                            />
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <div className="flex flex-wrap gap-3">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Generating…" : "Get solution"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setProblemNumber("");
                                    setDescription("");
                                    setResult(null);
                                    setError(null);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {result && (
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-2xl">{result.title || "Solution"}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Problem #{problemNumber}
                                </p>
                            </div>
                            {result.difficulty && (
                                <Badge variant="secondary">{result.difficulty}</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Array.isArray(result.topics) && result.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {result.topics.map((topic) => (
                                    <Badge key={topic} variant="outline">
                                        {topic}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {result.approach && (
                            <section className="space-y-2">
                                <h3 className="text-lg font-semibold">Approach</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {result.approach}
                                </p>
                            </section>
                        )}

                        {Array.isArray(result.steps) && result.steps.length > 0 && (
                            <section className="space-y-2">
                                <h3 className="text-lg font-semibold">Steps</h3>
                                <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                                    {result.steps.map((step, index) => (
                                        <li key={`${step}-${index}`}>{step}</li>
                                    ))}
                                </ol>
                            </section>
                        )}

                        {result.code && (
                            <section className="space-y-2">
                                <h3 className="text-lg font-semibold">Code</h3>
                                <pre className="rounded-lg border border-border bg-black/70 p-4 text-xs text-white overflow-x-auto">
                                    <code>{result.code}</code>
                                </pre>
                            </section>
                        )}

                        {(result.timeComplexity || result.spaceComplexity) && (
                            <section className="grid gap-2 sm:grid-cols-2">
                                {result.timeComplexity && (
                                    <div className="rounded-lg border border-border p-3">
                                        <p className="text-xs text-muted-foreground">Time Complexity</p>
                                        <p className="text-sm font-medium">{result.timeComplexity}</p>
                                    </div>
                                )}
                                {result.spaceComplexity && (
                                    <div className="rounded-lg border border-border p-3">
                                        <p className="text-xs text-muted-foreground">Space Complexity</p>
                                        <p className="text-sm font-medium">{result.spaceComplexity}</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {Array.isArray(result.examples) && result.examples.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="text-lg font-semibold">Examples</h3>
                                <div className="grid gap-3">
                                    {result.examples.map((example, index) => (
                                        <div key={index} className="rounded-lg border border-border p-3 text-sm">
                                            <p className="text-xs text-muted-foreground">Input</p>
                                            <p className="font-medium">{example.input}</p>
                                            <p className="mt-2 text-xs text-muted-foreground">Output</p>
                                            <p className="font-medium">{example.output}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
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
