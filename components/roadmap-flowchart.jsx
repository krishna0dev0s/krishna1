'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, BookOpen, Code, Trophy, X, ExternalLink, Video, FileText } from 'lucide-react';
import dagre from 'dagre';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Custom Node Component
function RoadmapNode({ data }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusColor = () => {
    if (data.completed) return 'border-green-500 bg-green-50 dark:bg-green-950/20';
    if (data.current) return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-lg shadow-blue-500/20';
    return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 hover:border-yellow-500';
  };
  
  const getIcon = () => {
    if (data.completed) return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
    if (data.current) return <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />;
    return <Circle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
  };
  
  const getTypeIcon = () => {
    switch (data.type) {
      case 'skill': return <Code className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      default: return null;
    }
  };
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative px-5 py-3 rounded-lg border-2
        transition-all duration-200 cursor-pointer min-w-[180px] max-w-[220px]
        ${getStatusColor()}
        ${isHovered ? 'shadow-xl -translate-y-1' : 'shadow-md'}
      `}
      onClick={() => data.onClick && data.onClick(data)}
    >
      {/* Status Indicator */}
      <div className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow-md">
        {getIcon()}
      </div>
      
      {/* Content */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {data.type && (
            <div className="text-xs opacity-70">
              {getTypeIcon()}
            </div>
          )}
          <h3 className="font-bold text-sm text-foreground line-clamp-2">{data.label}</h3>
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>
        )}
        
        {/* Progress Bar */}
        {data.progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{data.progress}% Complete</p>
          </div>
        )}
        
        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Hover Effect */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"
        />
      )}
    </motion.div>
  );
}

// Node types
const nodeTypes = {
  roadmapNode: RoadmapNode,
};

// Auto-layout using dagre
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 220;
  const nodeHeight = 120;
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });
  
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  dagre.layout(dagreGraph);
  
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    
    return node;
  });
  
  return { nodes, edges };
};

export default function RoadmapFlowchart({ roadmapData, onNodeClick }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [direction, setDirection] = useState('TB');
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, current, completed
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // Convert roadmap data to nodes and edges
  useEffect(() => {
    if (!roadmapData) return;
    
    const newNodes = [];
    const newEdges = [];
    
    // Create nodes from roadmap data
    roadmapData.forEach((section, sectionIdx) => {
      // Get topic data
      const topic = section.topics && section.topics[0] ? section.topics[0] : {};
      
      // Create node
      const nodeId = `node-${sectionIdx}`;
      newNodes.push({
        id: nodeId,
        type: 'roadmapNode',
        data: {
          label: section.title || section.week,
          description: typeof topic === 'object' ? topic.description : section.description,
          type: typeof topic === 'object' ? topic.type : 'course',
          completed: typeof topic === 'object' ? topic.completed : section.completed || false,
          current: typeof topic === 'object' ? topic.current : section.current || false,
          progress: typeof topic === 'object' ? topic.progress : undefined,
          tags: typeof topic === 'object' ? topic.tags : undefined,
          resources: typeof topic === 'object' ? topic.resources : undefined,
          onClick: (data) => {
            if (onNodeClick) onNodeClick(data);
          },
        },
        position: { x: 0, y: 0 },
      });
      
      // Connect to previous node
      if (sectionIdx > 0) {
        newEdges.push({
          id: `e-${sectionIdx - 1}-${sectionIdx}`,
          source: `node-${sectionIdx - 1}`,
          target: nodeId,
          type: 'smoothstep',
          animated: typeof topic === 'object' && topic.current,
          style: {
            stroke: typeof topic === 'object' && topic.completed ? '#22c55e' : '#94a3b8',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: typeof topic === 'object' && topic.completed ? '#22c55e' : '#94a3b8',
          },
        });
      }
    });
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
      direction
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [roadmapData, direction, setNodes, setEdges]);
  
  const onLayout = useCallback(
    (dir) => {
      setDirection(dir);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        dir
      );
      
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
  );
  
  const handleNodeClick = (node) => {
    setSelectedNode(node.data);
    setSidePanelOpen(true);
    if (onNodeClick) onNodeClick(node.data);
  };

  return (
    <div className="w-full h-[800px] bg-gradient-to-br from-background via-background to-muted/20 rounded-xl border shadow-lg overflow-hidden relative">
      {/* Top Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center justify-between p-4 gap-4">
          {/* Left: Layout Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => onLayout('TB')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                direction === 'TB'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              Vertical
            </button>
            <button
              onClick={() => onLayout('LR')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                direction === 'LR'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              Horizontal
            </button>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-md border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Right: Filter */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-md border bg-background text-sm font-medium cursor-pointer focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Topics</option>
              <option value="pending">📋 Pending</option>
              <option value="current">🔵 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground font-medium">Your Progress:</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${nodes.filter(n => n.data.completed).length / Math.max(nodes.length, 1) * 100}%` 
                }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
            <span className="text-muted-foreground font-semibold">
              {nodes.filter(n => n.data.completed).length}/{nodes.length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-24">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(e, node) => handleNodeClick(node)}
          onNodeMouseEnter={(e, node) => setHoveredNode(node.data)}
          onNodeMouseLeave={() => setHoveredNode(null)}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Controls 
            className="bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg"
            showInteractive={false}
          />
          <MiniMap
            className="bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg"
            nodeColor={(node) => {
              if (node.data.completed) return '#22c55e';
              if (node.data.current) return '#3b82f6';
              return '#eab308';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Background 
            variant="dots" 
            gap={20} 
            size={1.5} 
            className="bg-transparent" 
            color="#94a3b8"
            style={{ opacity: 0.3 }}
          />
        </ReactFlow>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredNode && !sidePanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-20 max-w-sm"
          >
            <div className="bg-card/95 backdrop-blur-md border shadow-2xl rounded-lg p-4">
              <h3 className="font-bold text-sm mb-1">{hoveredNode.label}</h3>
              {hoveredNode.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {hoveredNode.description}
                </p>
              )}
              <p className="text-xs text-primary mt-2">Click to view resources →</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Status Legend</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {sidePanelOpen && selectedNode && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 z-20"
              onClick={() => setSidePanelOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute right-0 top-0 bottom-0 w-full md:w-[480px] bg-card border-l shadow-2xl z-30 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{selectedNode.label}</h2>
                    {selectedNode.type && (
                      <Badge variant="outline" className="text-xs">
                        {selectedNode.type}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidePanelOpen(false)}
                    className="hover:bg-background"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedNode.completed ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => {
                      // Mark as completed
                      const updatedNodes = nodes.map(n => 
                        n.id === nodes.find(node => node.data.label === selectedNode.label)?.id
                          ? { ...n, data: { ...n.data, completed: !n.data.completed, current: false } }
                          : n
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, completed: !selectedNode.completed, current: false });
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {selectedNode.completed ? 'Completed' : 'Mark Complete'}
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedNode.current ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => {
                      // Mark as current
                      const updatedNodes = nodes.map(n => 
                        n.id === nodes.find(node => node.data.label === selectedNode.label)?.id
                          ? { ...n, data: { ...n.data, current: !n.data.current, completed: false } }
                          : n
                      );
                      setNodes(updatedNodes);
                      setSelectedNode({ ...selectedNode, current: !selectedNode.current, completed: false });
                    }}
                  >
                    <Circle className="h-4 w-4 mr-2" />
                    {selectedNode.current ? 'Learning' : 'Start Learning'}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {/* Description */}
                  {selectedNode.description && (
                    <div className="bg-muted/30 rounded-lg p-4 border">
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        About This Topic
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedNode.description}
                      </p>
                    </div>
                  )}

                  {/* Progress */}
                  {selectedNode.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="text-muted-foreground">{selectedNode.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${selectedNode.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedNode.tags && selectedNode.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Related Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Free Resources */}
                  {selectedNode.resources?.free && selectedNode.resources.free.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <span className="text-xs">✅</span>
                          </div>
                          Free Resources
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {selectedNode.resources.free.length} items
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {selectedNode.resources.free.map((resource, idx) => (
                          <motion.a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/30 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-md bg-green-50 dark:bg-green-950/20 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {resource.title}
                              </p>
                              {resource.type && (
                                <Badge variant="outline" className="text-xs mt-1.5">
                                  {resource.type}
                                </Badge>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Resources */}
                  {selectedNode.resources?.videos && selectedNode.resources.videos.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <Video className="w-3 h-3 text-red-600 dark:text-red-400" />
                          </div>
                          Video Tutorials
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {selectedNode.resources.videos.length} videos
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {selectedNode.resources.videos.map((resource, idx) => (
                          <motion.a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent hover:border-red-500/30 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-md bg-red-50 dark:bg-red-950/20 flex items-center justify-center flex-shrink-0">
                              <Video className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {resource.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">YouTube</p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Premium Resources */}
                  {selectedNode.resources?.premium && selectedNode.resources.premium.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded text-xs font-semibold">
                          ⭐ Premium Resources
                        </div>
                      </div>
                      <div className="space-y-2">
                        {selectedNode.resources.premium.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 p-3 rounded-lg border border-purple-200 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors group"
                          >
                            <Trophy className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {resource.title}
                              </p>
                              {resource.discount && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs mt-1">
                                  {resource.discount} Off
                                </Badge>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
