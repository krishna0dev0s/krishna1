# Evaluation Framework Documentation

## Overview
Comprehensive evaluation system for assessing interview performance, providing detailed metrics, insights, and recommendations.

## Features

### 1. Multi-Dimensional Scoring
- **Technical Competency** (35% weight)
  - Response accuracy
  - Knowledge depth
  - Technical terminology usage
  
- **Communication Skills** (25% weight)
  - Speech quality and pace
  - Articulation and coherence
  - Professional language
  
- **Problem-Solving** (25% weight)
  - Structured thinking
  - Solution completeness
  - Alternative approaches
  
- **Clarity** (15% weight)
  - Response conciseness
  - Fluency (pauses, filler words)
  - Answer relevance

### 2. Grading System
- A+ (90-100): Exceptional performance
- A (85-89): Excellent performance
- A- (80-84): Very good performance
- B+ (75-79): Good performance
- B (70-74): Above average
- B- (65-69): Average
- C+ (60-64): Below average
- C (55-59): Needs improvement
- C- (50-54): Significant improvement needed
- D (<50): Poor performance

### 3. Detailed Analytics
- Category breakdowns with factor analysis
- Percentile rankings
- Baseline comparisons
- Completion metrics
- Response length analysis

### 4. Insights & Recommendations
- Strengths identification
- Improvement areas
- Actionable recommendations per category
- Priority-based action items

## Usage

### Basic Evaluation
```javascript
import { evaluator } from '@/lib/evaluation-framework';

const interviewData = {
  transcript: ['response1', 'response2'],
  responses: [
    { text: 'detailed answer...', timestamp: Date.now() }
  ],
  audioMetrics: {
    pace: 140, // words per minute
    volume: { average: 0.6 },
    clarity: 85,
    pauseCount: 5
  },
  timing: {
    totalDuration: 1800000, // 30 minutes
    averageResponseTime: 45000 // 45 seconds
  },
  questionData: [
    {
      question: 'Explain closures',
      expectedKeywords: ['scope', 'function', 'lexical']
    }
  ]
};

const evaluation = evaluator.evaluateInterview(interviewData);
```

### Response Structure
```javascript
{
  scores: {
    technical: {
      score: 85.5,
      factors: [...],
      breakdown: [...]
    },
    communication: { ... },
    problemSolving: { ... },
    clarity: { ... }
  },
  weightedScore: 82.3,
  grade: 'A-',
  insights: [
    {
      type: 'strength',
      category: 'technical',
      message: 'Strong technical skills demonstrated',
      score: 85.5
    }
  ],
  recommendations: [
    {
      category: 'communication',
      priority: 'medium',
      actions: ['Practice explaining concepts clearly', ...]
    }
  ],
  detailedAnalysis: {
    performance: { ... },
    metrics: { ... },
    comparison: { ... }
  },
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

### Using with Components
```jsx
import EvaluationDashboard from '@/components/evaluation-dashboard';

export default function ResultsPage({ evaluationData }) {
  return <EvaluationDashboard evaluation={evaluationData} />;
}
```

### Utility Functions
```javascript
import {
  formatEvaluationReport,
  compareEvaluations,
  calculateTrends,
  aggregateSessionMetrics
} from '@/lib/evaluation-utils';

// Format for display
const report = formatEvaluationReport(evaluation);

// Compare sessions
const comparison = compareEvaluations(currentEval, previousEval);

// Track progress
const trends = calculateTrends([eval1, eval2, eval3]);

// Aggregate metrics
const stats = aggregateSessionMetrics(allEvaluations);
```

## Integration Examples

### With Voice Interview
```javascript
// In your voice interview component
import { evaluator } from '@/lib/evaluation-framework';

async function completeInterview(sessionData) {
  const evaluation = evaluator.evaluateInterview({
    transcript: sessionData.fullTranscript,
    responses: sessionData.userResponses,
    audioMetrics: sessionData.audioAnalysis,
    timing: sessionData.timingData,
    questionData: sessionData.questions
  });
  
  // Save to database
  await saveEvaluation(evaluation);
  
  // Display results
  return evaluation;
}
```

### With Database (Prisma)
```javascript
// Store evaluation in database
const savedEvaluation = await prisma.evaluation.create({
  data: {
    userId: user.id,
    interviewId: interview.id,
    scores: evaluation.scores,
    weightedScore: evaluation.weightedScore,
    grade: evaluation.grade,
    insights: evaluation.insights,
    recommendations: evaluation.recommendations,
    detailedAnalysis: evaluation.detailedAnalysis,
    timestamp: new Date(evaluation.timestamp)
  }
});

// Retrieve user's evaluation history
const history = await prisma.evaluation.findMany({
  where: { userId: user.id },
  orderBy: { timestamp: 'desc' }
});
```

### API Endpoint
```javascript
// app/api/evaluation/route.js
import { evaluator } from '@/lib/evaluation-framework';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const interviewData = await request.json();
    const evaluation = evaluator.evaluateInterview(interviewData);
    
    return NextResponse.json({ 
      success: true, 
      evaluation 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

## Customization

### Adjust Scoring Weights
```javascript
// Modify in evaluation-framework.js
constructor() {
  this.criteria = {
    technical: { weight: 0.40, maxScore: 100 }, // Increased from 0.35
    communication: { weight: 0.20, maxScore: 100 }, // Decreased
    problemSolving: { weight: 0.25, maxScore: 100 },
    clarity: { weight: 0.15, maxScore: 100 }
  };
}
```

### Add Custom Metrics
```javascript
evaluateCustomMetric(data) {
  // Your custom evaluation logic
  return {
    score: calculatedScore,
    factors: [...],
    breakdown: [...]
  };
}
```

### Extend Recommendations
```javascript
getRecommendationsForCategory(category, data) {
  const recommendations = {
    ...existingRecommendations,
    customCategory: [
      'Custom recommendation 1',
      'Custom recommendation 2'
    ]
  };
  return recommendations[category] || [];
}
```

## Best Practices

1. **Collect Comprehensive Data**: Ensure all relevant metrics are captured during interviews
2. **Validate Input**: Check data completeness before evaluation
3. **Store History**: Track evaluations over time for trend analysis
4. **Provide Context**: Include question difficulty and type in analysis
5. **User Privacy**: Handle evaluation data securely and privately

## Performance Considerations

- Evaluations run synchronously and complete in <100ms for typical interviews
- No external API calls required
- All calculations performed client-side or server-side
- Results can be cached for display optimization

## Future Enhancements

- [ ] Machine learning-based scoring refinement
- [ ] Industry-specific evaluation criteria
- [ ] Comparative analytics with anonymized peer data
- [ ] Real-time evaluation during interviews
- [ ] Multi-language support
- [ ] Video analysis integration
- [ ] Automated improvement tracking

## Support

For issues or questions about the evaluation framework:
- Check documentation in `/docs/evaluation`
- Review example implementations
- Contact development team

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained By**: Development Team
