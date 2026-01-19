"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, ChevronRight } from "lucide-react";
import AIInterviewAgent from "@/components/ai-interview-agent";
import { toast } from "sonner";

const ROLES = [
  { name: "Software Engineer", icon: "💻", description: "Full-stack, frontend, backend roles" },
  { name: "Product Manager", icon: "📊", description: "Strategic thinking and leadership" },
  { name: "Designer", icon: "🎨", description: "UX/UI and design thinking" },
  { name: "Sales Executive", icon: "💼", description: "Relationship building and closing" },
  { name: "Data Scientist", icon: "📈", description: "ML models and data analysis" },
];

const LEVELS = ["Junior", "Mid", "Senior"];

export default function AIInterviewPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("Mid");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleStartInterview = () => {
    if (!selectedRole) {
      toast.error("Please select a role first");
      return;
    }
    setInterviewStarted(true);
  };

  const handleInterviewComplete = (answersData) => {
    setAnswers(answersData);
    // You can save the answers and generate feedback here
    toast.success("Interview completed! Generating feedback...");
  };

  if (interviewStarted) {
    return (
      <AIInterviewAgent
        role={selectedRole}
        level={selectedLevel}
        onComplete={handleInterviewComplete}
      />
    );
  }

  return (
    <div className="w-full min-h-screen pt-20 pb-10 bg-gradient-to-br from-background via-background to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Interview Agent
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Practice with a professional AI interviewer. Get personalized questions based on your role and experience level.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: "🎯", title: "Role-Specific", desc: "Questions tailored to your role" },
            { icon: "🎤", title: "Voice Support", desc: "Speak naturally like real interviews" },
            { icon: "⚡", title: "Instant Feedback", desc: "AI evaluates your responses" },
            { icon: "🔄", title: "Unlimited Practice", desc: "Practice as many times as you want" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="text-center space-y-2"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Role Selection */}
        <div className="space-y-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Select Your Role</h2>
            <p className="text-gray-400 mb-6">
              Choose the position you're interviewing for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {ROLES.map((role) => (
              <motion.div
                key={role.name}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedRole(role.name)}
                className="cursor-pointer"
              >
                <Card
                  className={`h-full transition-all border-white/10 ${
                    selectedRole === role.name
                      ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50"
                      : "hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="text-4xl">{role.icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{role.name}</h3>
                      <p className="text-xs text-gray-400 mt-2">{role.description}</p>
                    </div>
                    {selectedRole === role.name && (
                      <Badge className="mt-2 bg-blue-500">Selected</Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold mb-4">Select Your Level</h2>
              <p className="text-gray-400 mb-6">
                Choose your experience level for {selectedRole}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LEVELS.map((level) => (
                <motion.div
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedLevel(level)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`h-full transition-all border-white/10 ${
                      selectedLevel === level
                        ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50"
                        : "hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <CardContent className="pt-8 text-center space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{level}</h3>
                        <p className="text-sm text-gray-400 mt-2">
                          {level === "Junior"
                            ? "0-2 years experience"
                            : level === "Mid"
                              ? "2-5 years experience"
                              : "5+ years experience"}
                        </p>
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>
                          {level === "Junior"
                            ? "✓ Foundational questions"
                            : level === "Mid"
                              ? "✓ Intermediate challenges"
                              : "✓ Advanced scenarios"}
                        </p>
                      </div>
                      {selectedLevel === level && (
                        <Badge className="mt-2 bg-purple-500">Selected</Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Start Interview Section */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <CardContent className="pt-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Ready to interview?
                    </h3>
                    <p className="text-gray-300">
                      You've selected <Badge className="ml-2">{selectedRole}</Badge>
                      <Badge className="ml-2" variant="outline">
                        {selectedLevel} Level
                      </Badge>
                    </p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                    <p>✓ Get role-specific questions</p>
                    <p>✓ Speak naturally with microphone support</p>
                    <p>✓ Receive instant AI-powered feedback</p>
                    <p>✓ Track your interview performance</p>
                  </div>

                  <Button
                    onClick={handleStartInterview}
                    size="lg"
                    className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Play className="h-5 w-5" />
                    Start Interview Now
                    <ChevronRight className="h-5 w-5 ml-auto" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-8"
        >
          <h3 className="text-xl font-semibold text-green-400 mb-4">💡 Interview Tips</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span>Speak clearly and at a normal pace</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span>Take time to think before answering</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span>Provide specific examples from your experience</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span>Ask thoughtful questions at the end</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span>Show enthusiasm about the role and company</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-400">✓</span>
              <span>Be authentic and confident</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
