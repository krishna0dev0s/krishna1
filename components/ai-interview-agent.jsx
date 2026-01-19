"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIInterviewAgent({ role = "Software Engineer", level = "Mid", onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [response, setResponse] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const questionPool = useMemo(() => generateQuestionsForRole(role, level), [role, level]);
  const currentQuestion = questionPool[questionIndex];

  const handleSubmit = () => {
    const trimmed = response.trim();
    if (!trimmed || !currentQuestion) return;

    const nextAnswers = [
      ...answers,
      {
        question: currentQuestion.question,
        answer: trimmed,
        category: currentQuestion.category,
      },
    ];

    setAnswers(nextAnswers);
    setResponse("");

    if (questionIndex < questionPool.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete(nextAnswers);
    }
  };

  const handleRestart = () => {
    setQuestionIndex(0);
    setAnswers([]);
    setResponse("");
    setIsComplete(false);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>AI Interview Session</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Role: <Badge className="ml-1">{role}</Badge> <Badge variant="outline" className="ml-2">{level}</Badge>
                </p>
              </div>
              <Badge variant="outline">{questionIndex + 1} / {questionPool.length}</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isComplete && currentQuestion && (
              <>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Question</p>
                  <p className="text-lg font-semibold">{currentQuestion.question}</p>
                  <p className="text-sm text-muted-foreground">Category: {currentQuestion.category}</p>
                </div>

                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full h-32 rounded-lg bg-white/5 border border-white/10 p-4 text-sm outline-none focus:border-blue-500/60"
                  placeholder="Share your answer here"
                />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{response.length} characters</span>
                  <span>{questionIndex + 1} of {questionPool.length} questions</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleRestart}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                  <Button className="flex-1" onClick={handleSubmit} disabled={!response.trim()}>
                    {questionIndex === questionPool.length - 1 ? "Finish" : "Next"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            )}

            {isComplete && (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="font-semibold">Interview complete</p>
                  <p className="text-sm text-muted-foreground">Thanks for sharing your responses.</p>
                </div>

                <div className="space-y-3">
                  {answers.map((entry, idx) => (
                    <div key={idx} className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
                      <p className="text-sm font-semibold">Q{idx + 1}: {entry.question}</p>
                      <p className="text-xs text-muted-foreground">Category: {entry.category}</p>
                      <p className="text-sm leading-relaxed">{entry.answer}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={handleRestart}>
                    Take Again
                  </Button>
                  {onComplete && (
                    <Button variant="outline" className="flex-1" onClick={() => onComplete(answers)}>
                      Share Feedback
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function generateQuestionsForRole(role, level) {
  const base = [
    {
      question: "Tell me about a recent project and your specific contributions.",
      category: "Experience",
    },
    {
      question: "How do you handle unexpected blockers or delays?",
      category: "Execution",
    },
    {
      question: "Describe a time you collaborated across teams.",
      category: "Collaboration",
    },
    {
      question: "What do you do to keep your skills sharp?",
      category: "Growth",
    },
  ];

  if (role.toLowerCase().includes("engineer")) {
    base.push({
      question: "How do you ensure code quality and reliability?",
      category: "Engineering",
    });
  }

  if (level.toLowerCase() === "senior") {
    base.push({
      question: "How do you mentor others and drive technical direction?",
      category: "Leadership",
    });
  }

  return base;
}
