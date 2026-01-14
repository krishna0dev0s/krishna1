# 🎙️ AI Voice Interview - User Guide

## Overview

The AI Voice Interview feature provides a fully interactive, AI-driven interview experience with real-time voice interaction, advanced analytics, and professional-grade audio controls.

## 🚀 Key Features

### 1. **Fully AI-Driven Conversations**
- No predefined questions - AI dynamically generates interview questions based on:
  - Your responses
  - The company you're interviewing for
  - The job position
  - Interview phase (introduction → technical → behavioral → closing)
- Natural conversation flow with contextual follow-up questions

### 2. **Real-Time Audio Visualization**
- Live audio level meter showing your voice input
- Animated waveform when speaking
- Visual feedback for recording status

### 3. **Intelligent Auto-Recording**
- **Auto-Submit Feature**: Automatically submits your answer after 2 seconds of silence
- Toggle on/off with checkbox
- Saves time and makes the interview feel more natural

### 4. **Sentiment Analysis**
- Real-time analysis of your response tone:
  - 😊 Positive
  - 😐 Neutral
  - 😟 Negative
- Helps you maintain a professional, upbeat tone

### 5. **Advanced Voice Controls**
- **Speech Rate**: Adjust AI voice speed (0.5x - 2.0x)
  - Slower for better comprehension
  - Faster to save time
- **Volume Control**: Adjust AI voice volume (0% - 100%)
- **Interrupt AI**: Stop AI speaking at any time with "Stop AI" button

### 6. **Real-Time Analytics Dashboard**
- **Questions Asked**: Track interview progress
- **Average Response Time**: Monitor your pacing
- **Confidence Score**: Speech recognition confidence (0-100%)
- **Sentiment Indicator**: Current emotional tone

### 7. **Enhanced Audio Quality**
- **Primary**: ElevenLabs TTS for professional-quality AI voice (if API key configured)
- **Fallback**: High-quality browser speech synthesis with enhanced voice selection
- **Advanced Audio Processing**:
  - Echo cancellation
  - Noise suppression
  - Automatic gain control

### 8. **Transcript Management**
- Real-time transcript display
- Word count tracking
- Download complete interview transcript as `.txt` file
- Timestamps for all messages

## 📋 How to Use

### Starting an Interview

1. **Navigate** to the Interview section
2. **Select** a company and job position
3. **Choose** "Start Voice Interview"
4. The AI will automatically greet you and ask for your name

### During the Interview

#### 🎤 Microphone Control
1. Click **"Start Mic"** to enable microphone
2. Grant browser permission when prompted
3. Start speaking naturally
4. Your transcript appears in real-time

#### 💬 Answering Questions
1. **Speak clearly** into your microphone
2. Watch the audio level meter for feedback
3. **Option A**: Enable "Auto-submit" - stops recording after 2s silence
4. **Option B**: Manually click "Submit Answer" when done

#### 🎛️ Customizing Audio
- **Adjust Speech Rate**: Use slider to change AI speaking speed
- **Adjust Volume**: Use slider to control AI voice volume
- **Stop AI Speaking**: Click "Stop AI" if you need to interrupt

#### 📊 Monitoring Progress
- Check the stats dashboard:
  - Questions: How many questions asked (target: ~12)
  - Avg Response: Your average answer time in seconds
  - Confidence: Speech recognition accuracy
  - Sentiment: Current emotional tone

### Ending the Interview

1. **Option A**: Wait for AI to naturally conclude after ~12 questions
2. **Option B**: Click "End Interview" button manually
3. **Download** your transcript for review
4. Review your performance analytics

## 💡 Best Practices

### Audio Setup
- ✅ Use a **quality microphone** or headset
- ✅ **Quiet environment** - minimize background noise
- ✅ Test audio before starting
- ✅ Position mic 6-12 inches from mouth

### During Interview
- ✅ Speak **clearly and naturally**
- ✅ **Pause briefly** between sentences
- ✅ Watch **sentiment indicator** - aim for positive/neutral
- ✅ Monitor **response time** - aim for 30-90 seconds per answer
- ✅ Use **auto-submit** for smoother experience

### Answer Quality
- ✅ Use **STAR method** (Situation, Task, Action, Result)
- ✅ Provide **specific examples** with numbers/metrics
- ✅ Keep answers **concise** (50-150 words typically)
- ✅ Maintain **positive tone**

## 🔧 Troubleshooting

### Microphone Not Working
1. Check browser permissions (usually top-left of address bar)
2. Ensure microphone is plugged in and selected
3. Try refreshing the page
4. Check system microphone settings

### Speech Recognition Issues
- **Not detecting speech**: Speak louder or move mic closer
- **Incorrect transcription**: Speak more slowly and clearly
- **Stops listening**: Auto-restarts every few seconds
- **Multiple languages**: Currently optimized for English

### Audio Playback Issues
- **No AI voice**: Check volume slider and system volume
- **Robotic voice**: ElevenLabs API key not configured (fallback mode)
- **Delayed response**: Normal - AI is thinking

### Auto-Submit Not Working
1. Ensure checkbox is checked
2. Pause for full 2 seconds after speaking
3. Make sure you've said something (not empty)

## 🎯 Interview Phases

The AI adapts its questions based on the current phase:

1. **Start**: Initial greeting and name collection
2. **Introduction**: "Tell me about yourself" type questions
3. **Technical**: Role-specific technical questions
4. **Behavioral**: STAR-format situational questions
5. **Closing**: Your questions, timeline, wrap-up

## 📈 Analytics Metrics Explained

### Questions Count
- Total questions asked during interview
- Target: 10-15 questions for comprehensive interview
- Each AI turn = 1 question

### Average Response Time
- Your average answer duration in seconds
- **Good range**: 45-90 seconds
- Too short: Might not be detailed enough
- Too long: Risk of rambling

### Confidence Score
- Speech recognition confidence (0-100%)
- **Excellent**: 90-100%
- **Good**: 70-89%
- **Fair**: 50-69%
- **Poor**: <50% (speak more clearly)

### Sentiment
- **Positive** 😊: Enthusiastic, confident tone
- **Neutral** 😐: Professional, factual tone
- **Negative** 😟: Defensive, uncertain tone
- *Aim for positive/neutral mix*

## ⚡ Keyboard Shortcuts

*Note: Currently click-based. Keyboard shortcuts planned for future release.*

## 🔐 Privacy & Data

- All conversations processed in real-time
- Transcripts can be downloaded locally
- No audio recordings stored on server
- API calls to OpenAI/Gemini follow their privacy policies
- ElevenLabs TTS (if enabled) follows their privacy policy

## 📱 Browser Compatibility

### ✅ Fully Supported
- Chrome/Edge (latest)
- Safari 14+
- Firefox (latest)

### ⚠️ Limited Support
- Mobile browsers (speech recognition limited)
- Internet Explorer (not supported)

## 🎓 Tips for Success

1. **Practice First**: Try 2-3 practice interviews before important ones
2. **Environment**: Use a quiet room with good acoustics
3. **Equipment**: Quality mic makes huge difference in recognition accuracy
4. **Energy**: Speak with enthusiasm - AI detects sentiment
5. **Preparation**: Research the company beforehand
6. **Examples Ready**: Have 5-7 STAR stories prepared
7. **Questions**: Prepare 2-3 questions for the "closing" phase
8. **Review**: Download and review transcript after each interview

## 🆘 Getting Help

### Common Questions

**Q: How long should my answers be?**
A: 45-90 seconds typically. Watch word count - aim for 50-150 words.

**Q: Can I pause during my answer?**
A: Yes! Natural pauses are fine. Auto-submit waits for 2 full seconds of silence.

**Q: What if AI asks an unclear question?**
A: Ask for clarification! Say "Could you clarify what you mean by..."

**Q: Can I redo an answer?**
A: Not currently - treat it like a real interview. Future feature planned.

**Q: How many questions will I get?**
A: Typically 10-15 questions covering all phases.

## 🎬 Example Session Flow

```
1. [AI]: "Welcome! What's your name?"
   [You]: "Hi, my name is Alex Johnson"

2. [AI]: "Great to meet you, Alex! Tell me about yourself."
   [You]: [60-second STAR response about background]

3. [AI]: "Interesting! You mentioned [X]. Can you elaborate on that?"
   [You]: [45-second specific example]

... continues through 12-15 questions ...

12. [AI]: "Do you have any questions for us?"
    [You]: "Yes, what does success look like in this role?"

13. [AI]: "Great question! [Response]. Thank you for your time today!"
```

## 📞 Support

For issues or feature requests:
1. Check this guide first
2. Review troubleshooting section
3. Contact development team with:
   - Browser version
   - Error message (if any)
   - Steps to reproduce

---

**Last Updated**: 2024
**Version**: 2.0 - Enhanced AI Voice Interview with Analytics
