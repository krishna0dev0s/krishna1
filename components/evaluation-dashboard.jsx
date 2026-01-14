'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Award, BarChart, CheckCircle } from 'lucide-react';

export default function EvaluationDashboard({ evaluation }) {

  if (!evaluation) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No evaluation data available</p>
        </CardContent>
      </Card>
    );
  }

  const { scores, weightedScore, grade, insights, recommendations, detailedAnalysis } = evaluation;

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Interview Evaluation</CardTitle>
              <CardDescription>Overall Performance Analysis</CardDescription>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{grade}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {Math.round(weightedScore)}/100
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={weightedScore} className="h-3" />
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-muted-foreground">Performance Score</span>
            <span className="font-medium">
              {detailedAnalysis?.performance?.percentile}th percentile
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(scores).map(([category, data]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize font-medium">{category}</span>
                  <Badge variant={getScoreVariant(data.score)}>
                    {Math.round(data.score)}
                  </Badge>
                </div>
                <Progress value={data.score} className="h-2" />
                
                {/* Factor Breakdown */}
                {data.breakdown && (
                  <div className="mt-2 pl-4 space-y-1">
                    {data.breakdown.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground capitalize">
                          {factor.metric}
                        </span>
                        <span className="text-xs">
                          {Math.round(factor.score)} × {factor.weight} = {factor.contribution}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights?.map((insight, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  insight.type === 'strength' ? 'bg-green-50 dark:bg-green-950' :
                  insight.type === 'improvement' ? 'bg-yellow-50 dark:bg-yellow-950' :
                  'bg-blue-50 dark:bg-blue-950'
                }`}
              >
                {insight.type === 'strength' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : insight.type === 'improvement' ? (
                  <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-blue-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-medium capitalize">{insight.category}</p>
                  <p className="text-sm text-muted-foreground">{insight.message}</p>
                </div>
                {insight.score && (
                  <Badge variant="outline">{Math.round(insight.score)}</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={recommendations?.[0]?.category || 'technical'}>
            <TabsList className="grid w-full grid-cols-4">
              {Object.keys(scores).map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {recommendations?.map((rec) => (
              <TabsContent key={rec.category} value={rec.category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {rec.actions?.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Metrics */}
      {detailedAnalysis?.metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Session Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="Questions Answered"
                value={detailedAnalysis.metrics.questionsAnswered}
              />
              <MetricCard
                label="Avg Response Length"
                value={`${detailedAnalysis.metrics.averageResponseLength} chars`}
              />
              <MetricCard
                label="Total Duration"
                value={formatDuration(detailedAnalysis.metrics.totalDuration)}
              />
              <MetricCard
                label="Completion Rate"
                value={`${detailedAnalysis.metrics.completionRate}%`}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function getScoreVariant(score) {
  if (score >= 85) return 'default';
  if (score >= 70) return 'secondary';
  if (score >= 60) return 'outline';
  return 'destructive';
}

function formatDuration(ms) {
  if (!ms) return '0s';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}
