'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { frontendRoadmap } from '@/data/frontend-roadmap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

const RoadmapFlowchart = dynamic(
  () => import('@/components/roadmap-flowchart-new'),
  { ssr: false }
);

export default function FrontendRoadmapPage() {
  const [showHints, setShowHints] = useState(true);
  
  // Initial progress - mark some as completed/current for demo
  const initialProgress = {
    'start': 'completed',
    'internet': 'completed',
    'http': 'completed',
    'dns': 'completed',
    'html': 'completed',
    'html-basics': 'completed',
    'semantic-html': 'completed',
    'forms': 'current',
    'accessibility': 'pending',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="mb-4 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Frontend Developer Roadmap
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Your interactive learning journey • Click any topic to start
            </p>
          </div>
        </div>

        {/* Hints Card */}
        {showHints && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900/30">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      Quick Tips
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1.5 ml-6">
                      <li>• <strong>Click any topic</strong> to view resources and mark progress</li>
                      <li>• <strong>Search</strong> to quickly find topics</li>
                      <li>• <strong>Filter by status</strong> to focus on what matters</li>
                      <li>• <strong>Zoom & pan</strong> to explore the full roadmap</li>
                      <li>• <strong>Toggle layout</strong> between vertical and horizontal views</li>
                    </ul>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHints(false)}
                    className="hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Roadmap Flowchart */}
        <Card className="p-0 overflow-hidden shadow-2xl h-[900px]">
          <RoadmapFlowchart
            roadmapData={frontendRoadmap}
            initialProgress={initialProgress}
          />
        </Card>
      </div>
    </div>
  );
}
