# AI-Driven Voice Interview Feature

## Overview
The voice interview feature has been completely redesigned to use **fully dynamic AI-generated conversations** with **maximum user experience enhancements**. No predefined messages, questions, or responses - everything is generated on-the-fly by AI based on the conversation context.

## Key Features

### 🤖 Fully AI-Driven
- **No predefined questions**: AI generates questions based on the role, company, and conversation flow
- **Dynamic responses**: AI adapts to candidate answers and asks intelligent follow-ups
- **Natural conversation**: Feels like talking to a real recruiter, not following a script
- **Context-aware**: Remembers last 6 exchanges and builds on them

### 🎙️ Advanced Voice Integration
- **Real-time Speech-to-Text**: Continuous recognition with interim results
- **Professional Text-to-Speech**: ElevenLabs (premium) or browser TTS (fallback)
- **Audio Visualization**: Real-time audio level monitoring
- **Echo Cancellation**: Noise suppression and auto gain control
- **Auto-Recording**: Automatically submits after 2 seconds of silence
- **Pause/Resume**: AI automatically pauses mic while speaking

### 📊 Analytics & Insights
- **Sentiment Analysis**: Detects positive, negative, or neutral tone
- **Confidence Scores**: Shows speech recognition confidence (0-100%)
- **Word Count Tracking**: Monitors response length
- **Average Response Time**: Tracks how quickly you respond
- **Question Progress**: Shows current question out of ~12 total

### 🎨 Enhanced UX
- **Visual Audio Levels**: Animated waveform showing mic input
- **Speech Rate Control**: Adjust AI speaking speed (0.5x - 2.0x)
- **Volume Control**: Adjust AI voice volume (0-100%)
- **Interim Transcripts**: See words as you speak (gray text)
- **Timestamp Tracking**: Each message tagged with time
- **Download Transcript**: Save full interview as text file
- **Auto-Submit**: Toggle automatic submission after silence
- **Stop AI**: Interrupt AI speech at any time
- **Clear Transcript**: Reset current answer quickly

## How It Works

### 1. Interview Phases
The AI automatically manages conversation phases:

- **Start/Greeting**: Warm introduction and asks for candidate's name
- **Introduction**: Gets to know the candidate, asks about their interest in the role
- **Interview**: Asks technical, behavioral, and situational questions
- **Closing**: Wraps up and thanks the candidate

### 2. AI Conversation Flow

```javascript
User Input → AI Analyzes Context → Generates Response → Speaks Response → Repeat
```

The AI considers:
- Current conversation phase
- Previous 6 exchanges (for context)
- Candidate's name and background
- Job title and company
- Natural conversation flow

### 3. API Endpoint

**`/api/interview/ai-conversation`**

```json
{
  "phase": "interview",
  "company": "Google",
  "jobTitle": "Software Engineer",
  "candidateName": "John",
  "userResponse": "I have 5 years of experience...",
  "conversationHistory": [...]
}
```

Response:
```json
{
  "success": true,
  "response": "That's impressive! Tell me about...",
  "phase": "interview",
  "shouldContinue": true
}
```

## Components

### DynamicVoiceInterview
**Location**: `app/(main)/interview/_components/dynamic-voice-interview.jsx`

Main component that handles:
- Speech recognition and synthesis
- Conversation state management
- API calls to AI conversation endpoint
- UI for voice interview

**Props**:
- `company`: Company name
- `job`: Job object with title and description
- `onBack`: Callback when user goes back
- `onComplete`: Callback when interview completes

## Usage

1. **Navigate to Interview Page**: `/interview`
2. **Search for a company** and select a job
3. **Click "Start Voice Interview"**
4. **Allow microphone access** when prompted
5. **Click "Start Recording"** to speak
6. **Submit your answer** after speaking
7. AI will respond and continue the conversation

## Configuration

### Required Environment Variables

```env
# Google Gemini API (Required)
GOOGLE_GEMINI_API_KEY=your_api_key

# ElevenLabs (Optional - for premium voice)
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key
```

### AI Model
- Uses **Gemini 2.0 Flash Exp** for fast, conversational responses
- Configured with:
  - `temperature: 0.9` (more creative/natural)
  - `topP: 0.95`
  - `maxOutputTokens: 1024`

## Benefits Over Previous Implementation

| Previous | New Enhanced Version |
|----------|---------------------|
| Fixed question list | Dynamic AI-generated questions |
| Predefined responses | Fully adaptive AI responses |
| Basic mic on/off | Advanced audio visualization |
| No analytics | Real-time sentiment & confidence |
| Manual submit only | Auto-submit after silence |
| Single volume level | Speech rate & volume controls |
| No feedback | Live audio level monitoring |
| Static flow | Smart pause/resume during AI speech |
| No history saving | Download full transcript |
| Limited awareness | Full conversation context memory |

## UI Features

### Stats Dashboard
Shows real-time metrics:
- **Questions**: Total questions asked
- **Avg Response**: Average time to respond
- **Confidence**: Speech recognition accuracy
- **Sentiment**: Emotional tone (😊 positive, 😐 neutral, 😟 negative)

### Audio Visualization
- Real-time audio level bar
- Animated listening indicator (3 pulsing bars)
- Visual feedback when AI is speaking

### Voice Controls
- **Speech Rate Slider**: Control how fast AI speaks (0.5x to 2.0x)
- **Volume Slider**: Adjust AI voice volume (0-100%)
- **Auto-Submit Toggle**: Enable/disable automatic submission

### Transcript View
- Shows your current response
- Interim words appear in gray (live preview)
- Word count displayed
- One-click clear button
- Timestamps on all messages
- Sentiment badges on responses

### Control Buttons
- **Start/Stop Mic**: Toggle microphone with visual feedback
- **Stop AI**: Interrupt AI speech immediately
- **Submit Answer**: Send your response
- **Download**: Save full transcript
- **End Interview**: Complete and save results

## Advanced Features

### Auto-Recording Mode
When enabled:
1. Starts listening when mic is on
2. Detects speech automatically
3. Waits 2 seconds after you stop talking
4. Automatically submits your answer
5. AI responds and pauses your mic
6. Resumes listening after AI finishes

### Smart Pause/Resume
- Mic automatically pauses when AI speaks
- Prevents echo and feedback
- Resumes automatically after AI finishes
- Shows "Paused (AI Speaking)" badge

### Error Handling
- Graceful fallback to browser TTS if ElevenLabs fails
- Auto-restart recognition if it stops unexpectedly
- Permission error messages
- API error recovery with toast notifications

```
AI: "Hey! Thanks so much for taking the time to chat with me today. What's your name?"
User: "Hi, I'm Sarah."

AI: "Nice to meet you, Sarah! So what drew you to this Software Engineer position at Google?"
User: "I've been passionate about scalable systems..."

AI: "That's fascinating! Tell me about a time when you had to optimize a system for scale. What was the challenge?"
User: [Answers...]

AI: "I like that approach. How did you measure the improvement in performance?"
[Conversation continues...]
```

## Troubleshooting

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS is enabled (required for microphone access)
- Try a different browser (Chrome/Edge recommended)

### AI Not Responding
- Verify `GOOGLE_GEMINI_API_KEY` is set correctly
- Check browser console for errors
- Ensure API quotas are not exceeded

### Voice Not Playing
- ElevenLabs will fallback to browser TTS if API key is missing
- Check audio output settings
- Ensure volume is not muted

## Future Enhancements

- [ ] Real-time sentiment analysis
- [ ] Live feedback on answer quality
- [ ] Resume parsing for personalized questions
- [ ] Video recording support
- [ ] Multi-language support
- [ ] Interview recording and playback
