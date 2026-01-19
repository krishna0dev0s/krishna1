import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

/**
 * Natural conversational acknowledgments to make the AI feel human
 */
const NATURAL_ACKNOWLEDGMENTS = {
  excellent: [
    "That's a great approach!",
    "I really like how you think about that.",
    "That's exactly the kind of mindset we're looking for.",
    "I appreciate that perspective.",
  ],
  interesting: ["Oh, that's interesting.", "I hadn't thought about it that way.", "That's a unique perspective."],
  thoughtful: ["That's really thoughtful.", "I can tell you've put a lot of thought into this.", "That shows great maturity."],
  practical: [
    "Very practical approach.",
    "I like the pragmatism there.",
    "That's a realistic way to think about it.",
  ],
};

export async function POST(request) {
  try {
    const { role, level, stage, userInput, questionIndex, previousAnswers, includeFollowUp } = await request.json();

    let prompt = "";

    if (stage === "introduction") {
      prompt = `You are a warm, friendly, and professional human interview conductor. You're about to start an interview with a candidate for a ${role} position at ${level} level.

Your greeting should:
- Sound genuine and conversational (NOT scripted or formal)
- Be warm and welcoming to make them comfortable
- Briefly explain what to expect in a casual way
- Use conversational language like "Hey", "So", "Alright", etc.
- Include a light touch of personality
- Be brief (2-3 sentences max)

Example tone: "Hey, thanks so much for taking the time to chat with me today! I'm really excited to learn more about your experience as a ${role}. We'll just go through some questions at a natural pace – think of this more as a conversation than a formal quiz, so just be yourself."

Now generate YOUR introduction. Keep it natural and human. Do NOT repeat this example.`;
    } else if (stage === "warmup") {
      prompt = `You are a warm, conversational human interviewer. The candidate just answered your warm-up question about themselves and what excites them about the ${role} role.

Their response was: "${userInput}"

Now give a NATURAL follow-up that:
- Shows genuine interest and warmth
- References something specific they said
- Feels like a real conversation, not scripted
- Asks a genuine follow-up question naturally
- Uses conversational phrases like "That's great!", "I love that", "Oh interesting", etc.
- Smoothly transitions to the actual interview questions
- Keep it to 1-2 sentences max

Example: "That's awesome – I love your passion for [specific thing they mentioned]. Let's dive into some more specific questions about your experience."

Generate YOUR response now, not this example.`;
    } else if (stage === "questions") {
      prompt = `You are a warm, empathetic, and conversational human interviewer.

The candidate just answered this question and gave this response: "${userInput}"

Your job is to:
1. Acknowledge their answer warmly and authentically
2. Show you're actually listening and engaged
3. Use natural conversational phrases like "That's great", "I love that perspective", "Oh interesting", etc.
4. If their answer was brief (less than 50 words), naturally probe deeper with curiosity
5. If it was detailed, acknowledge the depth and maybe ask for a specific example
6. Sound like you're genuinely curious about their experience
7. Keep it conversational and human (1-2 sentences)
8. Avoid sounding like you're checking off a box

Make it feel like a real conversation where the interviewer is genuinely engaged. NO SCRIPTS. BE REAL.

Example: "That's a perfect example – I really appreciate how you broke that down. Can you tell me more about how you handled the technical challenges in that project?"

Generate YOUR response now, making it feel authentic and human.`;
    } else if (stage === "closing") {
      prompt = `You are a warm, friendly human interviewer wrapping up a ${role} interview at ${level} level.

The candidate has just finished answering all their interview questions. You now want to:
1. Warmly thank them for their time
2. Express genuine interest in what you've learned
3. Sound authentic, not scripted
4. Invite them to ask questions naturally
5. Use conversational language like you're talking to a friend
6. Make it feel warm and positive
7. Keep it to 2-3 sentences

Example: "Thanks so much for chatting with me today – I really enjoyed learning about your experience and how you approach problems. Do you have any questions for me about the role or the team?"

Generate YOUR closing now. Make it sound like a real person, not an AI.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return Response.json({
      success: true,
      response: response.trim(),
      stage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Interview agent error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to generate response",
      },
      { status: 500 }
    );
  }
}
