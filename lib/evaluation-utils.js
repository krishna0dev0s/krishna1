/**
 * Utility functions for evaluation framework
 */

export function formatEvaluationReport(evaluation) {
  return {
    summary: {
      grade: evaluation.grade,
      score: evaluation.weightedScore,
      timestamp: evaluation.timestamp
    },
    scores: Object.entries(evaluation.scores).map(([category, data]) => ({
      category,
      score: Math.round(data.score * 100) / 100,
      breakdown: data.breakdown
    })),
    insights: evaluation.insights,
    recommendations: evaluation.recommendations,
    detailedAnalysis: evaluation.detailedAnalysis
  };
}

export function generatePDFReport(evaluation) {
  return {
    title: 'Interview Evaluation Report',
    date: new Date(evaluation.timestamp).toLocaleDateString(),
    sections: [
      {
        title: 'Overall Performance',
        content: {
          grade: evaluation.grade,
          score: evaluation.weightedScore,
          percentile: evaluation.detailedAnalysis.performance.percentile
        }
      },
      {
        title: 'Category Scores',
        content: evaluation.scores
      },
      {
        title: 'Key Insights',
        content: evaluation.insights
      },
      {
        title: 'Recommendations',
        content: evaluation.recommendations
      }
    ]
  };
}

export function compareEvaluations(current, previous) {
  if (!previous) return null;
  
  const comparison = {
    scoreChange: current.weightedScore - previous.weightedScore,
    gradeChange: current.grade !== previous.grade,
    improvements: [],
    declines: []
  };
  
  Object.entries(current.scores).forEach(([category, data]) => {
    const prevScore = previous.scores[category]?.score || 0;
    const change = data.score - prevScore;
    
    if (change > 5) {
      comparison.improvements.push({ category, change });
    } else if (change < -5) {
      comparison.declines.push({ category, change });
    }
  });
  
  return comparison;
}

export function calculateTrends(evaluations) {
  if (!evaluations || evaluations.length < 2) return null;
  
  const sorted = [...evaluations].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  const trends = {
    overall: {
      direction: sorted[sorted.length - 1].weightedScore > sorted[0].weightedScore ? 'up' : 'down',
      change: sorted[sorted.length - 1].weightedScore - sorted[0].weightedScore
    },
    categories: {}
  };
  
  Object.keys(sorted[0].scores).forEach(category => {
    const first = sorted[0].scores[category].score;
    const last = sorted[sorted.length - 1].scores[category].score;
    
    trends.categories[category] = {
      direction: last > first ? 'up' : 'down',
      change: last - first
    };
  });
  
  return trends;
}

export function getMetricColor(score) {
  if (score >= 85) return 'green';
  if (score >= 70) return 'blue';
  if (score >= 60) return 'yellow';
  return 'red';
}

export function formatInsightMessage(insight) {
  const icons = {
    strength: '✓',
    improvement: '!',
    pacing: '⏱',
    warning: '⚠'
  };
  
  return `${icons[insight.type] || '•'} ${insight.message}`;
}

export function aggregateSessionMetrics(sessions) {
  if (!sessions?.length) return null;
  
  return {
    totalSessions: sessions.length,
    averageScore: sessions.reduce((sum, s) => sum + s.weightedScore, 0) / sessions.length,
    bestScore: Math.max(...sessions.map(s => s.weightedScore)),
    mostImprovedArea: findMostImprovedArea(sessions),
    consistency: calculateConsistency(sessions)
  };
}

function findMostImprovedArea(sessions) {
  if (sessions.length < 2) return null;
  
  const improvements = {};
  const categories = Object.keys(sessions[0].scores);
  
  categories.forEach(category => {
    const first = sessions[0].scores[category].score;
    const last = sessions[sessions.length - 1].scores[category].score;
    improvements[category] = last - first;
  });
  
  const best = Object.entries(improvements).sort(([, a], [, b]) => b - a)[0];
  return { category: best[0], improvement: best[1] };
}

function calculateConsistency(sessions) {
  const scores = sessions.map(s => s.weightedScore);
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Lower standard deviation = more consistent
  if (stdDev < 5) return 'high';
  if (stdDev < 10) return 'medium';
  return 'low';
}
