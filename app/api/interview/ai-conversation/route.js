import { GoogleGenerativeAI } from "@google/generative-ai";
import { trace } from '@opentelemetry/api';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const tracer = trace.getTracer('watshibo-ai-interview');

/**
 * Dynamic AI-driven interview conversation with OpenTelemetry tracing
 * No predefined messages - AI handles everything based on context
 */
export async function POST(request) {
  // Create main span for the entire request
  return await tracer.startActiveSpan('interview.ai-conversation', async (span) => {
    try {
      const body = await request.json();
      const {
        conversationHistory = [],
        company,
        jobTitle,
        candidateName,
        phase,
        userResponse,
      } = body;

      // Add metadata to trace
      span.setAttributes({
        'interview.phase': phase || 'unknown',
        'interview.company': company || 'unknown',
        'interview.jobTitle': jobTitle || 'unknown',
        'interview.candidateName': candidateName || 'unknown',
        'conversation.historyLength': conversationHistory.length,
        'conversation.hasUserResponse': !!userResponse,
      });

      console.log('[AI Conversation] Phase:', phase, '| History length:', conversationHistory.length);

      if (!process.env.GOOGLE_GEMINI_API_KEY) {
        span.setStatus({ code: 2, message: 'AI service not configured' });
        span.end();
        return new Response(
          JSON.stringify({
            success: false,
            error: "AI service not configured",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
      });

      // Record model configuration in trace
      span.setAttributes({
        'ai.model': 'gemini-2.0-flash-exp',
        'ai.temperature': 0.9,
        'ai.topP': 0.95,
        'ai.topK': 40,
        'ai.maxTokens': 1024,
      });

      // Build context-aware prompt based on conversation history
      let systemPrompt = `You are a professional, warm, and engaging interviewer conducting a voice interview. 

CRITICAL INSTRUCTIONS:
- You are having a REAL-TIME VOICE conversation - keep responses SHORT (1-3 sentences max)
- Sound natural and conversational - like a real person, not robotic
- Use contractions (I'm, that's, you're) and casual language
- Show genuine interest and personality
- Ask ONE question at a time
- Listen actively and build on what the candidate says
- Provide brief acknowledgments before asking follow-ups

INTERVIEW CONTEXT:
Company: ${company || 'the company'}
Position: ${jobTitle || 'this role'}
${candidateName ? `Candidate Name: ${candidateName}` : 'Candidate name not yet known'}

CONVERSATION FLOW STAGES:
`;

      // Determine what to do based on phase and context
      if (phase === 'start' || conversationHistory.length === 0) {
        systemPrompt += `
CURRENT STAGE: Opening/Greeting
- Warmly greet the candidate
- Thank them for their time
- Ask for their name in a friendly way
- Keep it to 1-2 sentences

Example tone: "Hey! Thanks so much for taking the time to chat with me today. What's your name?"`;
      } else if (phase === 'introduction' || (conversationHistory.length <= 4 && !candidateName)) {
        systemPrompt += `
CURRENT STAGE: Getting to Know Candidate
- Build rapport naturally
- Ask about their background or what interests them about the role
- Be genuinely curious
- Keep it conversational, not interrogative

Example tone: "Nice to meet you! So what drew you to this ${jobTitle || 'position'}?"`;
      } else if (phase === 'interview' || conversationHistory.length >= 4) {
        systemPrompt += `
CURRENT STAGE: Technical/Behavioral Interview
- Ask relevant technical or behavioral questions for ${jobTitle || 'the role'}
- Build on their previous answers - show you're listening
- Ask thoughtful follow-ups based on what they just said
- Vary question types: situational, behavioral, technical, problem-solving
- If they give a good answer, acknowledge it briefly then probe deeper
- If they give a weak answer, ask a clarifying question
- Keep the conversation flowing naturally

Example tones:
- "That's interesting! How did you handle [specific detail they mentioned]?"
- "I like that approach. Walk me through your thought process there."
- "Got it. Let me ask you this..."`;
      } else if (phase === 'closing') {
        systemPrompt += `
CURRENT STAGE: Wrapping Up
- Thank them for their time
- Ask if they have any questions
- End on a positive note
- Keep it brief

Example tone: "This has been great! Do you have any questions for me about the role or team?"`;
      }

      // Add conversation history context
      if (conversationHistory.length > 0) {
        systemPrompt += `\n\nCONVERSATION SO FAR:\n`;
        conversationHistory.slice(-6).forEach((msg) => {
          const role = msg.role === 'interviewer' ? 'You' : 'Candidate';
          systemPrompt += `${role}: ${msg.content}\n`;
        });
      }

      // Add current user response if provided
      if (userResponse) {
        systemPrompt += `\nCandidate just said: "${userResponse}"\n`;
      }

      systemPrompt += `\n\nYOUR RESPONSE (remember: 1-3 sentences max, sound natural, like a real conversation):`;

      console.log('[AI Conversation] Generating response...');
      
      // Create child span for AI generation
      const result = await tracer.startActiveSpan('ai.generateContent', async (genSpan) => {
        genSpan.setAttributes({
          'ai.promptLength': systemPrompt.length,
          'ai.operation': 'generateContent',
        });
        
        try {
          const genResult = await model.generateContent(systemPrompt);
          genSpan.setStatus({ code: 1 }); // OK
          return genResult;
        } catch (error) {
          genSpan.setStatus({ code: 2, message: error.message });
          genSpan.recordException(error);
          throw error;
        } finally {
          genSpan.end();
        }
      });

      if (!result || !result.response) {
        throw new Error("No response from AI");
      }

      const aiResponse = result.response.text().trim();
      console.log('[AI Conversation] Generated:', aiResponse.substring(0, 100) + '...');

      // Record response metrics in trace
      span.setAttributes({
        'ai.responseLength': aiResponse.length,
        'ai.responsePreview': aiResponse.substring(0, 100),
      });

      // Detect if we should transition phases
      let suggestedPhase = phase;
      const responseLC = aiResponse.toLowerCase();
      
      if (responseLC.includes('thank') && (responseLC.includes('time') || responseLC.includes('today'))) {
        suggestedPhase = 'closing';
      } else if (conversationHistory.length <= 2) {
        suggestedPhase = 'introduction';
      } else if (conversationHistory.length > 2 && conversationHistory.length < 20) {
        suggestedPhase = 'interview';
      }

      // Record final phase in trace
      span.setAttributes({
        'interview.suggestedPhase': suggestedPhase,
        'interview.shouldContinue': !responseLC.includes('thank you for') || conversationHistory.length < 15,
      });

      span.setStatus({ code: 1 }); // OK
      span.end();

      return new Response(
        JSON.stringify({
          success: true,
          response: aiResponse,
          phase: suggestedPhase,
          shouldContinue: !responseLC.includes('thank you for') || conversationHistory.length < 15,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("[AI Conversation] Error:", error.message);

      // Record error in trace
      span.setStatus({ code: 2, message: error.message });
      span.recordException(error);
      span.end();

      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to generate response",
          fallback: "Tell me more about that.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  });
}
