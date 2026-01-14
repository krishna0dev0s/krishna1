'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Activity, BookOpen, X, ExternalLink, Youtube, Sparkles, ArrowDown, ArrowRight } from 'lucide-react';
import dagre from 'dagre';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Auto-layout using dagre (more reliable than ELK for this use case)
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: isHorizontal ? 80 : 150, // Increased spacing
    ranksep: isHorizontal ? 200 : 120,
    marginx: 50,
    marginy: 50
  });

  nodes.forEach((node) => {
    // Larger dimensions for better spacing
    const width = node.data.type === 'start' || node.data.type === 'end' ? 220 : 260;
    const height = node.data.type === 'start' || node.data.type === 'end' ? 80 : 120;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.data.type === 'start' || node.data.type === 'end' ? 220 : 260;
    const height = node.data.type === 'start' || node.data.type === 'end' ? 80 : 120;
    
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    
    // Use manual positioning from data if layout is 'CUSTOM'
    if (direction === 'CUSTOM') {
      node.position = {
        x: node.data.originalPosition.x * 300,
        y: node.data.originalPosition.y * 150,
      };
    } else {
      node.position = {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      };
    }

    return node;
  });

  return { nodes, edges };
};

export default function RoadmapFlowchart({ roadmapData, initialProgress = {}, onAddToQueue }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [layout, setLayout] = useState('TB');
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [nodeProgress, setNodeProgress] = useState(initialProgress);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hoveredNode, setHoveredNode] = useState(null);
  
  const getStatusColor = (nodeId, type) => {
    const progress = nodeProgress[nodeId];
    
    // Cyberpunk / Neon Tech Palette
    if (progress === 'completed') return 'bg-gradient-to-br from-emerald-900/80 to-emerald-950/90 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
    if (progress === 'current') return 'bg-gradient-to-br from-blue-900/80 to-blue-950/90 border-blue-500 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.4)]';
    return 'bg-gradient-to-br from-slate-900/90 to-slate-950/95 border-slate-700 text-slate-300 hover:border-blue-400/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]';
  };

  const RoadmapNode = ({ data, sourcePosition = Position.Bottom, targetPosition = Position.Top }) => {
    const isHovered = hoveredNode === data.id;
    const status = nodeProgress[data.id] || 'pending';
    const nodeType = data.type || 'skill';
    
    const isStartOrEnd = nodeType === 'start' || nodeType === 'end';
    
    return (
      <div
        className={`px-4 py-3 rounded-xl border transition-all duration-300 cursor-pointer relative group backdrop-blur-md
        ${getStatusColor(data.id, nodeType)}
        ${isHovered ? 'scale-110 z-50 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950' : 'shadow-xl'}
        ${isStartOrEnd ? 'rounded-full px-8 py-4 border-2 font-bold tracking-widest uppercase' : ''}`}
        style={{ 
          width: isStartOrEnd ? '200px' : '220px',
          minHeight: isStartOrEnd ? '70px' : '90px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Tech decorative corners */}
        {!isStartOrEnd && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current opacity-50 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current opacity-50 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50 rounded-br-sm" />
          </>
        )}

        <Handle 
          type="target" 
          position={targetPosition} 
          className="!w-4 !h-4 !bg-slate-950 !border-2 !border-current transition-colors" 
        />
        
        <div className="flex flex-col items-center gap-2 w-full relative z-10">
          <div className="flex items-center gap-2 justify-center w-full">
            {status === 'completed' && (
              <div className="p-1 rounded-full bg-emerald-500/20">
                <CheckCheck className="w-4 h-4 text-emerald-400" />
              </div>
            )}
            {status === 'current' && (
              <div className="p-1 rounded-full bg-blue-500/20 animate-pulse">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
            )}
            {status === 'pending' && !isStartOrEnd && (
               <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            )}
            
            <span className={`font-bold text-center leading-tight ${isStartOrEnd ? 'text-lg' : 'text-sm'}`}>
              {data.label}
            </span>
          </div>
          
          {!isStartOrEnd && (
            <div className="flex items-center gap-2 mt-1">
               {(nodeType === 'core' || nodeType === 'framework') && (
                <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-current opacity-70 font-mono uppercase tracking-wider">
                  {nodeType}
                </Badge>
              )}
              {data.resources && (
                 <div className="flex gap-1 opacity-50">
                    {data.resources.videos?.length > 0 && <Youtube className="w-3 h-3" />}
                    {data.resources.free?.length > 0 && <BookOpen className="w-3 h-3" />}
                 </div>
              )}
            </div>
          )}
        </div>

        <Handle 
          type="source" 
          position={sourcePosition} 
          className="!w-4 !h-4 !bg-slate-950 !border-2 !border-current transition-colors" 
        />
      </div>
    );
  };

  const nodeTypes = {
    roadmapNode: RoadmapNode,
  };
  
  // Initialize nodes and edges from roadmap data
  useEffect(() => {
    if (!roadmapData?.nodes) return;
    
    const init = () => {
      const newNodes = roadmapData.nodes.map((node) => ({
        id: node.id,
        type: 'roadmapNode',
        position: node.position,
        data: {
          ...node,
          originalPosition: node.position,
        },
      }));
      
      const newEdges = roadmapData.edges.map((edge, idx) => ({
        id: `e-${idx}`,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#64748b',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#64748b',
        },
      }));
      
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        newNodes,
        newEdges,
        layout
      );
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    };
    
    init();
  }, [roadmapData, layout]);
  
  const handleNodeClick = (event, node) => {
    console.log('Node clicked:', node);
    setSelectedNode(node.data);
    setSidePanelOpen(true);
  };
  
  const updateNodeStatus = (nodeId, status) => {
    setNodeProgress(prev => ({
      ...prev,
      [nodeId]: status
    }));
    
    if (status === 'completed') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#6366F1']
      });
    }
  };
  
  // Filter nodes based on search and status
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = searchQuery === '' || 
      node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.data.description && node.data.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
      (nodeProgress[node.data.id] || 'pending') === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const completedCount = Object.values(nodeProgress).filter(status => status === 'completed').length;
  const totalCount = roadmapData?.nodes?.length || 0;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full h-full bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 shadow-2xl">
      {/* Top Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder:text-slate-500"
            />
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
          
          {/* Layout Toggle */}
          <div className="flex gap-2">
            <Button 
              variant={layout === 'CUSTOM' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setLayout('CUSTOM')}
              className={`${layout === 'CUSTOM' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Roadmap View
            </Button>
            <Button 
              variant={layout === 'TB' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setLayout('TB')}
              className={`${layout === 'TB' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <ArrowDown className="w-4 h-4 mr-1" />
              Vertical
            </Button>
            <Button 
              variant={layout === 'LR' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setLayout('LR')}
              className={`${layout === 'LR' ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <ArrowRight className="w-4 h-4 mr-1" />
              Horizontal
            </Button>
          </div>
          
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Topics</option>
            <option value="pending">Pending</option>
            <option value="current">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Progress</span>
            <span className="text-xs font-medium text-slate-300">{completedCount}/{totalCount} completed</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flowchart */}
      <div className="relative w-full h-full mt-32">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onNodeMouseEnter={(event, node) => setHoveredNode(node.data.id)}
          onNodeMouseLeave={() => setHoveredNode(null)}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 0.8 }}
          className="bg-transparent"
          minZoom={0.2}
          maxZoom={2}
        >
          <Background color="#334155" gap={24} size={2} variant="dots" />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-200 [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button:hover]:!bg-slate-700 [&>button]:!fill-slate-300" />
        </ReactFlow>
        
        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredNode && nodes.find(n => n.data.id === hoveredNode) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-36 left-4 bg-slate-900/95 backdrop-blur rounded-lg shadow-xl p-4 max-w-xs z-20 border border-slate-700 text-slate-200"
            >
              <h4 className="font-bold text-sm mb-1 text-white">{nodes.find(n => n.data.id === hoveredNode).data.label}</h4>
              <p className="text-xs text-slate-400">{nodes.find(n => n.data.id === hoveredNode).data.description}</p>
              <Badge className="mt-2 text-xs bg-slate-800 text-slate-300 border-slate-700">{nodes.find(n => n.data.id === hoveredNode).data.type}</Badge>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Status Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur rounded-lg shadow-lg p-3 border border-slate-800 z-20">
          <h4 className="text-xs font-bold mb-2 text-slate-300 uppercase tracking-wider">Status Legend</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-slate-600 bg-slate-800" />
              <span className="text-xs text-slate-400">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-blue-500 bg-blue-950" />
              <span className="text-xs text-slate-400">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-emerald-500 bg-emerald-950" />
              <span className="text-xs text-slate-400">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel - Rendered via Portal to avoid clipping */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {sidePanelOpen && selectedNode && (
            <>
              {/* Backdrop for mobile/focus */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidePanelOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              />
              
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 w-[400px] h-full bg-slate-950 shadow-2xl border-l border-slate-800 z-[9999] flex flex-col"
              >
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-bold text-white tracking-tight">{selectedNode.label}</h2>
                      <button
                        onClick={() => setSidePanelOpen(false)}
                        className="hover:bg-slate-800 p-2 rounded-full transition text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 uppercase tracking-wider text-xs">{selectedNode.type}</Badge>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-900/20"
                        onClick={() => updateNodeStatus(selectedNode.id, 'completed')}
                      >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600"
                        onClick={() => updateNodeStatus(selectedNode.id, 'current')}
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                      {onAddToQueue && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600"
                          onClick={() => {
                            onAddToQueue(selectedNode);
                            setSidePanelOpen(false);
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Queue
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <ScrollArea className="flex-1 p-6 bg-slate-950">
                    <div className="space-y-8 pb-20">
                      {/* Description */}
                      {selectedNode.description && (
                        <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                              <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed mt-1">{selectedNode.description}</p>
                          </div>
                        </div>
                      )}

                      {/* Free Resources */}
                      {selectedNode.resources?.free && selectedNode.resources.free.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
                              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                              Free Resources
                            </h3>
                            <Badge variant="secondary" className="bg-slate-800 text-slate-400">{selectedNode.resources.free.length}</Badge>
                          </div>
                          <div className="space-y-3">
                            {selectedNode.resources.free.map((resource, idx) => (
                              <motion.a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="block p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-blue-500/50 hover:bg-slate-800/80 transition-all group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                                      <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-blue-300 transition-colors">
                                      {resource.title}
                                    </span>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                </div>
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Video Resources */}
                      {selectedNode.resources?.videos && selectedNode.resources.videos.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
                              <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                              Video Tutorials
                            </h3>
                            <Badge variant="secondary" className="bg-slate-800 text-slate-400">{selectedNode.resources.videos.length}</Badge>
                          </div>
                          <div className="space-y-3">
                            {selectedNode.resources.videos.map((video, idx) => (
                              <motion.a
                                key={idx}
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="block p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-red-500/50 hover:bg-slate-800/80 transition-all group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-red-500/10 transition-colors">
                                      <Youtube className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium text-slate-300 group-hover:text-red-300 block transition-colors">
                                        {video.title}
                                      </span>
                                      <span className="text-xs text-slate-500">YouTube</span>
                                    </div>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-red-400 transition-colors" />
                                </div>
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
