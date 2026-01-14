/**
 * Evaluation Framework for Interview Performance
 * Provides metrics, scoring, and analysis for audio-based interviews
 */

export class InterviewEvaluator {
  constructor() {
    this.criteria = {
      technical: { weight: 0.35, maxScore: 100 },
      communication: { weight: 0.25, maxScore: 100 },
      problemSolving: { weight: 0.25, maxScore: 100 },
      clarity: { weight: 0.15, maxScore: 100 }
    };
  }

  /**
   * Evaluate interview performance
   * @param {Object} interviewData - Interview session data
   * @returns {Object} Evaluation results
   */
  evaluateInterview(interviewData) {
    const {
      transcript,
      responses,
      audioMetrics,
      timing,
      questionData
    } = interviewData;

    const scores = {
      technical: this.evaluateTechnical(responses, questionData),
      communication: this.evaluateCommunication(transcript, audioMetrics),
      problemSolving: this.evaluateProblemSolving(responses),
      clarity: this.evaluateClarity(transcript, audioMetrics)
    };

    const weightedScore = this.calculateWeightedScore(scores);
    const insights = this.generateInsights(scores, interviewData);
    const recommendations = this.generateRecommendations(scores);

    return {
      scores,
      weightedScore,
      grade: this.getGrade(weightedScore),
      insights,
      recommendations,
      detailedAnalysis: this.getDetailedAnalysis(scores, interviewData),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Evaluate technical competency
   */
  evaluateTechnical(responses, questionData) {
    let score = 0;
    const factors = [];

    // Accuracy of responses
    const accuracy = this.calculateAccuracy(responses, questionData);
    score += accuracy * 0.4;
    factors.push({ metric: 'accuracy', value: accuracy, weight: 0.4 });

    // Depth of knowledge
    const depth = this.analyzeDepth(responses);
    score += depth * 0.35;
    factors.push({ metric: 'depth', value: depth, weight: 0.35 });

    // Use of technical terminology
    const terminology = this.analyzeTechnicalTerminology(responses);
    score += terminology * 0.25;
    factors.push({ metric: 'terminology', value: terminology, weight: 0.25 });

    return { score, factors, breakdown: this.createBreakdown(factors) };
  }

  /**
   * Evaluate communication skills
   */
  evaluateCommunication(transcript, audioMetrics) {
    let score = 0;
    const factors = [];

    // Speech clarity and pace
    const speechQuality = this.analyzeSpeechQuality(audioMetrics);
    score += speechQuality * 0.3;
    factors.push({ metric: 'speechQuality', value: speechQuality, weight: 0.3 });

    // Articulation and coherence
    const coherence = this.analyzeCoherence(transcript);
    score += coherence * 0.35;
    factors.push({ metric: 'coherence', value: coherence, weight: 0.35 });

    // Professional language
    const professionalism = this.analyzeProfessionalism(transcript);
    score += professionalism * 0.35;
    factors.push({ metric: 'professionalism', value: professionalism, weight: 0.35 });

    return { score, factors, breakdown: this.createBreakdown(factors) };
  }

  /**
   * Evaluate problem-solving approach
   */
  evaluateProblemSolving(responses) {
    let score = 0;
    const factors = [];

    // Structured thinking
    const structure = this.analyzeStructure(responses);
    score += structure * 0.4;
    factors.push({ metric: 'structure', value: structure, weight: 0.4 });

    // Solution completeness
    const completeness = this.analyzeCompleteness(responses);
    score += completeness * 0.35;
    factors.push({ metric: 'completeness', value: completeness, weight: 0.35 });

    // Alternative approaches
    const alternatives = this.analyzeAlternatives(responses);
    score += alternatives * 0.25;
    factors.push({ metric: 'alternatives', value: alternatives, weight: 0.25 });

    return { score, factors, breakdown: this.createBreakdown(factors) };
  }

  /**
   * Evaluate clarity of responses
   */
  evaluateClarity(transcript, audioMetrics) {
    let score = 0;
    const factors = [];

    // Conciseness
    const conciseness = this.analyzeConciseness(transcript);
    score += conciseness * 0.35;
    factors.push({ metric: 'conciseness', value: conciseness, weight: 0.35 });

    // Pauses and filler words
    const fluency = this.analyzeFluency(audioMetrics, transcript);
    score += fluency * 0.35;
    factors.push({ metric: 'fluency', value: fluency, weight: 0.35 });

    // Response relevance
    const relevance = this.analyzeRelevance(transcript);
    score += relevance * 0.3;
    factors.push({ metric: 'relevance', value: relevance, weight: 0.3 });

    return { score, factors, breakdown: this.createBreakdown(factors) };
  }

  // Helper methods for analysis
  calculateAccuracy(responses, questionData) {
    if (!responses?.length || !questionData?.length) return 50;
    
    let correctCount = 0;
    responses.forEach((response, idx) => {
      const question = questionData[idx];
      if (question?.expectedKeywords) {
        const keywords = question.expectedKeywords.filter(kw =>
          response.text?.toLowerCase().includes(kw.toLowerCase())
        );
        correctCount += (keywords.length / question.expectedKeywords.length) * 100;
      }
    });
    
    return Math.min(correctCount / responses.length, 100);
  }

  analyzeDepth(responses) {
    if (!responses?.length) return 40;
    
    const avgLength = responses.reduce((sum, r) => sum + (r.text?.length || 0), 0) / responses.length;
    const hasExamples = responses.filter(r => 
      r.text?.toLowerCase().includes('example') || 
      r.text?.toLowerCase().includes('for instance')
    ).length;
    
    let score = Math.min((avgLength / 500) * 60, 60);
    score += (hasExamples / responses.length) * 40;
    
    return Math.min(score, 100);
  }

  analyzeTechnicalTerminology(responses) {
    if (!responses?.length) return 30;
    
    const technicalPatterns = [
      /\b(algorithm|complexity|data structure|optimization|scalability)\b/gi,
      /\b(API|REST|GraphQL|database|SQL|NoSQL)\b/gi,
      /\b(async|promise|callback|event|stream)\b/gi,
      /\b(component|state|props|hook|lifecycle)\b/gi,
      /\b(authentication|authorization|security|encryption)\b/gi
    ];
    
    let termCount = 0;
    responses.forEach(r => {
      technicalPatterns.forEach(pattern => {
        const matches = r.text?.match(pattern);
        termCount += matches ? matches.length : 0;
      });
    });
    
    return Math.min((termCount / responses.length) * 20, 100);
  }

  analyzeSpeechQuality(audioMetrics) {
    if (!audioMetrics) return 60;
    
    const { pace, volume, clarity } = audioMetrics;
    
    // Ideal pace: 120-150 words per minute
    let paceScore = 100;
    if (pace < 100 || pace > 180) paceScore = 60;
    else if (pace < 120 || pace > 150) paceScore = 80;
    
    const volumeScore = volume?.average > 0.3 && volume?.average < 0.8 ? 100 : 70;
    const clarityScore = clarity || 75;
    
    return (paceScore * 0.4 + volumeScore * 0.3 + clarityScore * 0.3);
  }

  analyzeCoherence(transcript) {
    if (!transcript?.length) return 50;
    
    const text = Array.isArray(transcript) ? transcript.join(' ') : transcript;
    const sentences = text.split(/[.!?]+/);
    
    // Check for transition words
    const transitions = /(first|second|finally|however|therefore|moreover|additionally)/gi;
    const transitionCount = (text.match(transitions) || []).length;
    
    let score = Math.min((transitionCount / sentences.length) * 100, 60);
    score += sentences.length > 3 ? 40 : 20;
    
    return Math.min(score, 100);
  }

  analyzeProfessionalism(transcript) {
    if (!transcript?.length) return 60;
    
    const text = Array.isArray(transcript) ? transcript.join(' ') : transcript;
    
    // Deduct for unprofessional markers
    const fillerWords = (text.match(/\b(um|uh|like|you know|basically)\b/gi) || []).length;
    const slangWords = (text.match(/\b(gonna|wanna|gotta|yeah|nah)\b/gi) || []).length;
    
    let score = 100;
    score -= Math.min(fillerWords * 2, 30);
    score -= Math.min(slangWords * 3, 20);
    
    return Math.max(score, 40);
  }

  analyzeStructure(responses) {
    if (!responses?.length) return 45;
    
    const structuredResponses = responses.filter(r => {
      const text = r.text?.toLowerCase() || '';
      return text.includes('first') || text.includes('approach') || 
             text.includes('step') || text.includes('solution');
    });
    
    return (structuredResponses.length / responses.length) * 100;
  }

  analyzeCompleteness(responses) {
    if (!responses?.length) return 50;
    
    const completeResponses = responses.filter(r => {
      const length = r.text?.length || 0;
      return length > 100 && length < 1000;
    });
    
    return (completeResponses.length / responses.length) * 100;
  }

  analyzeAlternatives(responses) {
    if (!responses?.length) return 40;
    
    const withAlternatives = responses.filter(r => {
      const text = r.text?.toLowerCase() || '';
      return text.includes('alternative') || text.includes('another approach') ||
             text.includes('could also') || text.includes('instead');
    });
    
    return Math.min((withAlternatives.length / responses.length) * 100 + 30, 100);
  }

  analyzeConciseness(transcript) {
    if (!transcript?.length) return 50;
    
    const text = Array.isArray(transcript) ? transcript.join(' ') : transcript;
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Ideal: 15-25 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 25) return 100;
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 30) return 80;
    return 60;
  }

  analyzeFluency(audioMetrics, transcript) {
    if (!audioMetrics && !transcript) return 55;
    
    const text = Array.isArray(transcript) ? transcript.join(' ') : (transcript || '');
    const fillerCount = (text.match(/\b(um|uh|er|ah)\b/gi) || []).length;
    const wordCount = text.split(/\s+/).length;
    
    const fillerRatio = fillerCount / wordCount;
    let score = 100 - (fillerRatio * 500);
    
    if (audioMetrics?.pauseCount) {
      const pauseRatio = audioMetrics.pauseCount / (wordCount / 100);
      score -= Math.min(pauseRatio * 10, 20);
    }
    
    return Math.max(score, 40);
  }

  analyzeRelevance(transcript) {
    if (!transcript?.length) return 55;
    
    const text = Array.isArray(transcript) ? transcript.join(' ') : transcript;
    
    // Check if responses stay on topic (basic heuristic)
    const questionWords = /(what|how|why|when|where|explain|describe|discuss)/gi;
    const hasQuestionContext = (text.match(questionWords) || []).length;
    
    return hasQuestionContext > 0 ? 85 : 60;
  }

  calculateWeightedScore(scores) {
    let totalScore = 0;
    
    Object.entries(scores).forEach(([category, data]) => {
      const weight = this.criteria[category]?.weight || 0;
      const score = data.score || 0;
      totalScore += score * weight;
    });
    
    return Math.round(totalScore * 100) / 100;
  }

  getGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'D';
  }

  generateInsights(scores, interviewData) {
    const insights = [];
    
    // Identify strengths
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b.score - a.score);
    
    insights.push({
      type: 'strength',
      category: sortedScores[0][0],
      message: `Strong ${sortedScores[0][0]} skills demonstrated`,
      score: sortedScores[0][1].score
    });
    
    // Identify areas for improvement
    const weakest = sortedScores[sortedScores.length - 1];
    if (weakest[1].score < 70) {
      insights.push({
        type: 'improvement',
        category: weakest[0],
        message: `Focus on improving ${weakest[0]} skills`,
        score: weakest[1].score
      });
    }
    
    // Response time analysis
    if (interviewData.timing?.averageResponseTime > 30000) {
      insights.push({
        type: 'pacing',
        category: 'timing',
        message: 'Consider more concise responses',
        value: interviewData.timing.averageResponseTime
      });
    }
    
    return insights;
  }

  generateRecommendations(scores) {
    const recommendations = [];
    
    Object.entries(scores).forEach(([category, data]) => {
      if (data.score < 70) {
        recommendations.push({
          category,
          priority: 'high',
          actions: this.getRecommendationsForCategory(category, data)
        });
      } else if (data.score < 85) {
        recommendations.push({
          category,
          priority: 'medium',
          actions: this.getRecommendationsForCategory(category, data)
        });
      }
    });
    
    return recommendations;
  }

  getRecommendationsForCategory(category, data) {
    const recommendations = {
      technical: [
        'Review fundamental concepts and design patterns',
        'Practice coding challenges regularly',
        'Study system design principles',
        'Build projects to demonstrate practical knowledge'
      ],
      communication: [
        'Practice explaining concepts clearly and concisely',
        'Record yourself and review for improvement',
        'Use the STAR method for behavioral questions',
        'Reduce filler words through mindful speaking'
      ],
      problemSolving: [
        'Practice breaking down complex problems',
        'Think aloud during problem-solving',
        'Consider multiple approaches before choosing one',
        'Discuss trade-offs in your solutions'
      ],
      clarity: [
        'Structure responses with clear beginning, middle, and end',
        'Practice active listening and stay on topic',
        'Avoid rambling by preparing concise answers',
        'Use examples to illustrate points effectively'
      ]
    };
    
    return recommendations[category] || [];
  }

  getDetailedAnalysis(scores, interviewData) {
    return {
      performance: {
        overall: this.calculateWeightedScore(scores),
        categories: scores,
        percentile: this.calculatePercentile(this.calculateWeightedScore(scores))
      },
      metrics: {
        questionsAnswered: interviewData.responses?.length || 0,
        averageResponseLength: this.calculateAverageResponseLength(interviewData.responses),
        totalDuration: interviewData.timing?.totalDuration || 0,
        completionRate: this.calculateCompletionRate(interviewData)
      },
      comparison: {
        baseline: this.getBaselineComparison(scores),
        improvement: this.calculateImprovement(interviewData)
      }
    };
  }

  createBreakdown(factors) {
    return factors.map(f => ({
      metric: f.metric,
      score: Math.round(f.value * 100) / 100,
      weight: f.weight,
      contribution: Math.round(f.value * f.weight * 100) / 100
    }));
  }

  calculateAverageResponseLength(responses) {
    if (!responses?.length) return 0;
    const total = responses.reduce((sum, r) => sum + (r.text?.length || 0), 0);
    return Math.round(total / responses.length);
  }

  calculateCompletionRate(interviewData) {
    const expected = interviewData.questionData?.length || 1;
    const answered = interviewData.responses?.length || 0;
    return Math.round((answered / expected) * 100);
  }

  calculatePercentile(score) {
    // Simple percentile calculation (can be enhanced with actual data)
    if (score >= 90) return 95;
    if (score >= 80) return 85;
    if (score >= 70) return 70;
    if (score >= 60) return 50;
    return 30;
  }

  getBaselineComparison(scores) {
    const baseline = {
      technical: 65,
      communication: 70,
      problemSolving: 68,
      clarity: 72
    };
    
    return Object.entries(scores).map(([category, data]) => ({
      category,
      yourScore: data.score,
      baseline: baseline[category],
      difference: Math.round((data.score - baseline[category]) * 100) / 100
    }));
  }

  calculateImprovement(interviewData) {
    // Placeholder for tracking improvement over time
    return {
      trend: 'improving',
      percentageChange: 0,
      previousScore: null
    };
  }
}

// Export singleton instance
export const evaluator = new InterviewEvaluator();
