"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Brain, Zap, Award, Play, ChevronRight, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const INTERVIEW_SCENARIOS = [
  {
    id: "react-junior",
    role: "Frontend Developer",
    level: "Junior",
    type: "Technical",
    techStack: ["React", "JavaScript", "CSS"],
    duration: "20 mins",
    difficulty: "Easy",
    description: "Practice React fundamentals and JavaScript basics",
    icon: "🚀",
  },
  {
    id: "fullstack-mid",
    role: "Full Stack Developer",
    level: "Mid",
    type: "Mixed",
    techStack: ["Node.js", "React", "MongoDB"],
    duration: "30 mins",
    difficulty: "Medium",
    description: "Frontend and backend concepts combined",
    icon: "⚙️",
  },
  {
    id: "backend-senior",
    role: "Backend Engineer",
    level: "Senior",
    type: "Technical",
    techStack: ["Python", "PostgreSQL", "AWS"],
    duration: "40 mins",
    difficulty: "Hard",
    description: "Advanced system design and architecture",
    icon: "🏗️",
  },
  {
    id: "behavioral-all",
    role: "Software Engineer",
    level: "Mid",
    type: "Behavioral",
    techStack: ["Communication", "Leadership", "Problem Solving"],
    duration: "25 mins",
    difficulty: "Medium",
    description: "Soft skills and company culture fit",
    icon: "💼",
  },
  {
    id: "devops-senior",
    role: "DevOps Engineer",
    level: "Senior",
    type: "Technical",
    techStack: ["Docker", "Kubernetes", "CI/CD"],
    duration: "35 mins",
    difficulty: "Hard",
    description: "Infrastructure and deployment practices",
    icon: "🐳",
  },
  {
    id: "ml-mid",
    role: "ML Engineer",
    level: "Mid",
    type: "Mixed",
    techStack: ["Python", "TensorFlow", "Data Science"],
    duration: "30 mins",
    difficulty: "Hard",
    description: "Machine learning concepts and implementation",
    icon: "🤖",
  },
];

const SAMPLE_QUESTIONS = [
  {
    question: "Tell me about a challenging project you worked on recently?",
    type: "Behavioral",
    category: "Communication",
  },
  {
    question: "How would you optimize a React component with multiple re-renders?",
    type: "Technical",
    category: "Problem Solving",
  },
  {
    question: "Explain the event loop in JavaScript.",
    type: "Technical",
    category: "Technical Knowledge",
  },
  {
    question: "How do you handle conflicts with team members?",
    type: "Behavioral",
    category: "Cultural Fit",
  },
  {
    question: "Design a database schema for an e-commerce platform.",
    type: "Technical",
    category: "Problem Solving",
  },
];

const SAMPLE_FEEDBACK = {
  totalScore: 78,
  categoryScores: [
    { name: "Communication Skills", score: 85, comment: "Clear and articulate responses" },
    { name: "Technical Knowledge", score: 72, comment: "Good fundamentals, room for deeper expertise" },
    { name: "Problem Solving", score: 78, comment: "Logical approach with minor gaps" },
    { name: "Cultural Fit", score: 82, comment: "Strong team player mentality" },
    { name: "Confidence and Clarity", score: 75, comment: "Generally confident, some hesitation on complex topics" },
  ],
  strengths: [
    "Excellent communication and explanation skills",
    "Strong problem-solving approach with clear thinking",
    "Good cultural alignment with company values",
  ],
  areasForImprovement: [
    "Deepen knowledge of advanced React patterns",
    "Practice system design questions",
    "Improve confidence when dealing with edge cases",
  ],
  finalAssessment:
    "Overall, you demonstrated solid technical skills and great soft skills. Focus on expanding your knowledge in advanced topics to move to the next level.",
};

export default function MockInterviewDemoPage() {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const handleSelectInterview = (scenario) => {
    setSelectedInterview(scenario);
    setShowQuestions(false);
    setShowFeedback(false);
    setCurrentQuestionIdx(0);
    toast.success(`Selected ${scenario.role} - ${scenario.level} interview`);
  };

  const handleStartPreview = () => {
    setShowQuestions(true);
    setShowFeedback(false);
  };

  const handleViewFeedback = () => {
    setShowFeedback(true);
    setShowQuestions(false);
  };

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

        {!selectedInterview ? (
          // Interview Selection View
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Mock Interview Platform
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Practice your interview skills with AI-powered mock interviews. Get instant feedback and improve your performance.
              </p>
            </div>

            {/* Quick Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <motion.div whileHover={{ y: -5 }} className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold text-white">Realistic Interviews</h3>
                <p className="text-sm text-gray-400">AI-powered questions</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold text-white">Instant Feedback</h3>
                <p className="text-sm text-gray-400">Detailed analysis</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-semibold text-white">Track Progress</h3>
                <p className="text-sm text-gray-400">Improve over time</p>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="text-center">
                <div className="text-4xl mb-2">🎓</div>
                <h3 className="font-semibold text-white">Learn & Grow</h3>
                <p className="text-sm text-gray-400">Get actionable insights</p>
              </motion.div>
            </div>

            {/* Interview Grid */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Choose Your Interview</h2>
                <p className="text-gray-400">Select a role and interview type to get started</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INTERVIEW_SCENARIOS.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ y: -8 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.random() * 0.3 }}
                  >
                    <Card
                      onClick={() => handleSelectInterview(scenario)}
                      className="cursor-pointer h-full transition-all border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-4xl">{scenario.icon}</span>
                          <Badge
                            variant="outline"
                            className={
                              scenario.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-300"
                                : scenario.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-red-500/20 text-red-300"
                            }
                          >
                            {scenario.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{scenario.role}</CardTitle>
                        <CardDescription>{scenario.level} Level</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-300">{scenario.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Badge variant="secondary" className="text-xs">
                              {scenario.type}
                            </Badge>
                            <span className="text-xs">•</span>
                            <span className="text-xs">{scenario.duration}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {scenario.techStack.map((tech, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-white/5">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 mt-4">
                          <Play className="h-4 w-4" />
                          Start Interview
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          // Interview Details View
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Back Button for Selected Interview */}
            <Button
              onClick={() => setSelectedInterview(null)}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Selection
            </Button>

            {/* Interview Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {selectedInterview.icon} {selectedInterview.role}
                  </h1>
                  <p className="text-gray-400">
                    {selectedInterview.level} Level • {selectedInterview.type} Interview
                  </p>
                </div>
                <Badge variant="outline" className="text-base py-2 px-3">
                  {selectedInterview.duration}
                </Badge>
              </div>

              <p className="text-lg text-gray-300">{selectedInterview.description}</p>

              <div className="flex flex-wrap gap-2">
                {selectedInterview.techStack.map((tech, idx) => (
                  <Badge key={idx} className="bg-blue-500/20 text-blue-300">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interview Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Mic className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Interview Type</p>
                      <p className="font-semibold">{selectedInterview.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Brain className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Difficulty</p>
                      <p className="font-semibold">{selectedInterview.difficulty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/20 rounded-lg">
                      <Zap className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Duration</p>
                      <p className="font-semibold">{selectedInterview.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Sections */}
            {!showQuestions && !showFeedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Interview Preview</h2>

                {/* Tips Section */}
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-400" />
                      Tips for Success
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Speak clearly and maintain a professional tone</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Take time to think before answering complex questions</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Provide specific examples from your experience</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Ask clarifying questions if needed</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Show enthusiasm about the role and company</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleStartPreview}
                    size="lg"
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Play className="h-5 w-5" />
                    Preview Questions
                  </Button>
                  <Button
                    onClick={handleViewFeedback}
                    size="lg"
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Award className="h-5 w-5" />
                    View Sample Feedback
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Questions Preview */}
            {showQuestions && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Sample Questions</h2>
                  <Badge variant="outline">
                    {currentQuestionIdx + 1} / {SAMPLE_QUESTIONS.length}
                  </Badge>
                </div>

                <Card className="border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-blue-500/20 text-blue-300">
                        {SAMPLE_QUESTIONS[currentQuestionIdx].type}
                      </Badge>
                      <Badge variant="outline">
                        {SAMPLE_QUESTIONS[currentQuestionIdx].category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {SAMPLE_QUESTIONS[currentQuestionIdx].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/30 rounded-lg p-6 border border-white/5">
                      <p className="text-gray-300 italic">
                        This is where you would provide your answer. In a real interview, you'd speak your response out loud, and the AI would transcribe it.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
                    variant="outline"
                    disabled={currentQuestionIdx === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestionIdx(Math.min(SAMPLE_QUESTIONS.length - 1, currentQuestionIdx + 1))}
                    variant="outline"
                    disabled={currentQuestionIdx === SAMPLE_QUESTIONS.length - 1}
                  >
                    Next
                  </Button>
                  <Button
                    onClick={handleViewFeedback}
                    className="ml-auto gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Award className="h-4 w-4" />
                    See Sample Feedback
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Feedback Display */}
            {showFeedback && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold">Sample Feedback Report</h2>

                {/* Overall Score */}
                <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <CardContent className="pt-8">
                    <div className="text-center space-y-3">
                      <p className="text-gray-400">Overall Score</p>
                      <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {SAMPLE_FEEDBACK.totalScore}/100
                      </div>
                      <p className="text-gray-300">Great performance! Keep practicing to reach excellence.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Scores */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">Category Breakdown</h3>
                  {SAMPLE_FEEDBACK.categoryScores.map((category, idx) => (
                    <Card key={idx} className="border-white/10">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{category.name}</p>
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {category.score}/100
                            </Badge>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${category.score}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                            />
                          </div>
                          <p className="text-sm text-gray-400">{category.comment}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Strengths and Areas for Improvement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-green-500/20 bg-green-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {SAMPLE_FEEDBACK.strengths.map((strength, idx) => (
                          <li key={idx} className="flex gap-2 text-gray-300">
                            <span className="text-green-400">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-500/20 bg-orange-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-400">
                        <AlertCircle className="h-5 w-5" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {SAMPLE_FEEDBACK.areasForImprovement.map((area, idx) => (
                          <li key={idx} className="flex gap-2 text-gray-300">
                            <span className="text-orange-400">→</span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Final Assessment */}
                <Card className="border-white/10">
                  <CardHeader>
                    <CardTitle>Final Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {SAMPLE_FEEDBACK.finalAssessment}
                    </p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setShowFeedback(false);
                      setShowQuestions(false);
                    }}
                    className="flex-1 gap-2"
                  >
                    Back to Preview
                  </Button>
                  <Button
                    onClick={() => setSelectedInterview(null)}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    Try Another Interview
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
