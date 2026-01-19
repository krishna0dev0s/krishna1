/**
 * Conversational Interview Helper
 * Generates natural, human-like responses and acknowledgments
 */

// Natural acknowledgment phrases for different types of answers
const ACKNOWLEDGMENT_PHRASES = {
  excellent: [
    "That's a great approach!",
    "I really like how you think about that.",
    "That's exactly the kind of mindset we're looking for.",
    "I appreciate that perspective.",
    "That's a solid way to handle it.",
  ],
  interesting: [
    "Oh, that's interesting.",
    "I hadn't thought about it that way.",
    "That's a unique perspective.",
    "Tell me more about that.",
    "I like where your head's at.",
  ],
  thoughtful: [
    "That's really thoughtful.",
    "I can tell you've put a lot of thought into this.",
    "That shows great maturity in your thinking.",
    "I appreciate the depth there.",
    "That's well-considered.",
  ],
  practical: [
    "Very practical approach.",
    "I like the pragmatism there.",
    "That's a realistic way to think about it.",
    "Very grounded thinking.",
    "That's hands-on experience showing.",
  ],
  ambitious: [
    "I love the ambition there.",
    "That's impressive thinking.",
    "You're clearly aiming high.",
    "I respect that drive.",
    "That shows real passion.",
  ],
};

// Follow-up probing questions that feel natural
const FOLLOW_UP_QUESTIONS = {
  brief: [
    "Could you walk me through a specific example?",
    "What did that look like in practice?",
    "Can you tell me more about how that worked out?",
    "What was the biggest challenge with that?",
    "How did that impact your work?",
  ],
  technical: [
    "What was the most technical part of that challenge?",
    "How did you solve the technical aspects?",
    "What technologies or tools did you use?",
    "What would you do differently with what you know now?",
    "How did you approach debugging that?",
  ],
  behavioral: [
    "How did that make you feel?",
    "What did you learn from that experience?",
    "How would you handle that differently now?",
    "What was the most valuable lesson?",
    "How did your team react to that?",
  ],
  contextual: [
    "What was the context around that situation?",
    "Why was that important to the team?",
    "What was the bigger picture there?",
    "How did that fit into your overall goals?",
    "What was the impact on the business?",
  ],
};

// Transition phrases between topics
const TRANSITION_PHRASES = [
  "Great, thanks for that. Moving on...",
  "I really appreciate that answer. Let's dive into...",
  "Excellent. Now I'd like to explore...",
  "That's really helpful to know. Next...",
  "Perfect, I can definitely see that. Let's talk about...",
  "I love that perspective. Here's something I'm curious about...",
  "Thanks for sharing that. Let me ask you about...",
];

// Closing phrases based on interview vibe
const CLOSING_PHRASES = {
  strong: [
    "You've impressed me with your depth of knowledge and how you think about problems.",
    "I've really enjoyed learning about your experience and your approach to challenges.",
    "You clearly have a strong grasp of what matters in this role.",
  ],
  solid: [
    "I appreciate your honest and thoughtful answers throughout our conversation.",
    "You've given me a good sense of your experience and your thinking.",
    "Thanks for being open and genuine throughout this interview.",
  ],
  curious: [
    "You've got some interesting ideas and a great attitude toward learning.",
    "I can tell you care about growth and continuous improvement.",
    "Your enthusiasm for the role really comes through.",
  ],
};

/**
 * Get a random element from an array
 */
export function getRandomPhrase(phrases) {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Generate a natural acknowledgment based on answer characteristics
 */
export function generateAcknowledgment(answerType = "excellent") {
  return getRandomPhrase(ACKNOWLEDGMENT_PHRASES[answerType] || ACKNOWLEDGMENT_PHRASES.excellent);
}

/**
 * Generate a natural follow-up question based on context
 */
export function generateFollowUp(context = "brief") {
  return getRandomPhrase(FOLLOW_UP_QUESTIONS[context] || FOLLOW_UP_QUESTIONS.brief);
}

/**
 * Get a transition phrase
 */
export function getTransitionPhrase() {
  return getRandomPhrase(TRANSITION_PHRASES);
}

/**
 * Get a closing phrase based on interview assessment
 */
export function getClosingPhrase(performance = "solid") {
  return getRandomPhrase(CLOSING_PHRASES[performance] || CLOSING_PHRASES.solid);
}

/**
 * Analyze answer length and suggest follow-up style
 */
export function analyzeAnswerLength(answer) {
  const wordCount = answer.trim().split(/\s+/).length;
  if (wordCount < 30) return "brief";
  if (wordCount < 80) return "moderate";
  return "detailed";
}

/**
 * Detect if answer seems technical or behavioral
 */
export function detectAnswerType(answer, questionType = "general") {
  const technicalKeywords = ["code", "database", "api", "system", "architecture", "debug", "deploy", "test"];
  const behavioralKeywords = ["team", "conflict", "challenge", "learned", "improved", "felt", "handled"];

  const answerLower = answer.toLowerCase();
  const techScore = technicalKeywords.filter((kw) => answerLower.includes(kw)).length;
  const behavScore = behavioralKeywords.filter((kw) => answerLower.includes(kw)).length;

  if (techScore > behavScore) return "technical";
  if (behavScore > techScore) return "behavioral";
  return "contextual";
}

/**
 * Generate a complete, natural conversational response
 * (This is a helper for more advanced scenarios)
 */
export function buildConversationalResponse(components) {
  const { acknowledgment, probing, transition, tone = "warm" } = components;

  let response = acknowledgment || "";

  if (probing) {
    response += " " + probing;
  }

  if (transition) {
    response += " " + transition;
  }

  return response.trim();
}

/**
 * Get empathetic language variants
 */
export const EMPATHY_PHRASES = {
  understanding: [
    "I can see how that would be challenging.",
    "That sounds like a tough situation.",
    "I understand the difficulty there.",
    "That's a really relatable challenge.",
  ],
  validation: [
    "That's a completely valid approach.",
    "Your instinct there was spot-on.",
    "That makes total sense.",
    "You're thinking about this the right way.",
  ],
  encouragement: [
    "That shows great problem-solving.",
    "I really respect how you handled that.",
    "That's the kind of thinking we need.",
    "That's exactly the mindset we're looking for.",
  ],
};

/**
 * Get a random empathy phrase
 */
export function getEmpathyPhrase(type = "understanding") {
  return getRandomPhrase(EMPATHY_PHRASES[type] || EMPATHY_PHRASES.understanding);
}
