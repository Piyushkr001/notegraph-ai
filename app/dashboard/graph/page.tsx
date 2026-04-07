"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Network, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import KnowledgeGraph, { GraphData } from "@/components/graph/KnowledgeGraph";

type TopicResponse = {
  id: string;
  name: string;
  noteId: string;
};

type RelationshipResponse = {
  id: string;
  sourceTopic: string;
  targetTopic: string;
  relationType: string;
};

export default function GlobalGraphPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const [relationships, setRelationships] = useState<RelationshipResponse[]>([]);

  const fetchGraphData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/dashboard/graph");
      setTopics(data.topics || []);
      setRelationships(data.relationships || []);
    } catch {
      toast.error("Failed to load global knowledge graph");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const graphData = useMemo<GraphData>(() => {
    // 1. Unique set of names
    const nodeSet = new Set<string>();
    topics.forEach((t) => nodeSet.add(t.name));
    relationships.forEach((r) => {
      nodeSet.add(r.sourceTopic);
      nodeSet.add(r.targetTopic);
    });

    // 2. Count connections to size nodes appropriately (pagerank basic logic)
    const connections: Record<string, number> = {};
    Array.from(nodeSet).forEach(name => connections[name] = 0);
    relationships.forEach(r => {
      if (connections[r.sourceTopic] !== undefined) connections[r.sourceTopic] += 1;
      if (connections[r.targetTopic] !== undefined) connections[r.targetTopic] += 1;
    });

    const nodes = Array.from(nodeSet).map((name) => {
      // Base size is 4, add extra size per connection
      const val = 3 + Math.min(connections[name] || 0, 10);
      return { id: name, name, val };
    });

    const links = relationships.map((r) => ({
      source: r.sourceTopic,
      target: r.targetTopic,
      label: r.relationType,
    }));

    return { nodes, links };
  }, [topics, relationships]);

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="flex items-center gap-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mix-blend-normal">
            <Network className="h-8 w-8 text-indigo-500" />
            Knowledge Graph.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Explore connections across all your notes intelligently mapped by AI.
          </p>
        </div>
        
        <Button variant="outline" onClick={fetchGraphData} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Refresh Graph
        </Button>
      </div>

      <div className="relative flex-1 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 shadow-sm backdrop-blur-xl overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : graphData.nodes.length > 0 ? (
          <KnowledgeGraph data={graphData} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center space-y-3">
            <Network className="h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-semibold">Your graph is empty</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Create and process some notes to start building your personal knowledge graph. The AI will automatically connect the concepts for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
