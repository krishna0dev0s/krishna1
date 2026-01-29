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
