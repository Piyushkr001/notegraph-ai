"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CalendarDays,
  Clock,
  FileText,
  Loader2,
  RefreshCcw,
  Sparkles,
  Tag,
  Workflow,
  X,
  Network,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import KnowledgeGraph, { GraphData } from "@/components/graph/KnowledgeGraph";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NoteStatus = "draft" | "pending" | "processing" | "completed" | "failed";
type NoteType =
  | "study"
  | "meeting"
  | "research"
  | "personal"
  | "technical";

type Topic = {
  id: string;
  name: string;
  description: string | null;
};

type Relationship = {
  id: string;
  sourceTopic: string;
  targetTopic: string;
  relationType: string;
};

type NoteDetail = {
  id: string;
  title: string;
  rawContent: string;
  shortSummary: string | null;
  detailedSummary: string | null;
  noteType: NoteType;
  status: NoteStatus;
  wordCount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  processingStartedAt: string | null;
  processingCompletedAt: string | null;
  tags: string[];
  topics: Topic[];
  relationships: Relationship[];
};

const STATUS_CONFIG: Record<
  NoteStatus,
  {
    label: string;
    className: string;
    icon: React.ReactNode;
  }
> = {
  draft: {
    label: "Draft",
    className:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    icon: <FileText className="h-3 w-3" />,
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    icon: <Clock className="h-3 w-3" />,
  },
  processing: {
    label: "Processing",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  completed: {
    label: "Processed",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    icon: <Sparkles className="h-3 w-3" />,
  },
  failed: {
    label: "Failed",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    icon: <X className="h-3 w-3" />,
  },
};

const TYPE_CONFIG: Record<NoteType, { label: string; emoji: string }> = {
  study: { label: "Study", emoji: "📚" },
  meeting: { label: "Meeting", emoji: "🤝" },
  research: { label: "Research", emoji: "🔬" },
  personal: { label: "Personal", emoji: "✍️" },
  technical: { label: "Technical", emoji: "⚙️" },
};

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-9/12" />
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params?.noteId as string;

  const [note, setNote] = useState<NoteDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchNote = useCallback(async () => {
    if (!noteId) return;

    try {
      setIsLoading(true);

      const { data } = await axios.get(`/api/dashboard/notes/${noteId}`);
      setNote(data);
      setNotFound(false);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        setNotFound(true);
        setNote(null);
        return;
      }

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data ||
          "Failed to load note"
      );
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  useEffect(() => {
    if (!note) return;
    if (note.status !== "pending" && note.status !== "processing") return;

    const interval = setInterval(() => {
      fetchNote();
    }, 4000);

    return () => clearInterval(interval);
  }, [note, fetchNote]);

  async function handleReprocess() {
    if (!note) return;

    setIsReprocessing(true);

    try {
      await axios.post("/api/dashboard/notes/process", {
        noteId: note.id,
      });

      toast.success("AI processing completed");
      await fetchNote();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data ||
          "Failed to reprocess note"
      );
    } finally {
      setIsReprocessing(false);
    }
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (notFound || !note) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-muted p-5">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Note not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The note may have been deleted or you may not have access to it.
          </p>
        </div>

        <Button
          onClick={() => router.push("/dashboard/notes")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Button>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[note.status];
  const typeConf = TYPE_CONFIG[note.noteType];

  let graphData: GraphData | null = null;
  if (note.topics.length > 0 || note.relationships.length > 0) {
    // Map existing topics to nodes based on topic names
    // It's possible a relationship references a topic not in topics array (model hallucination), 
    // so we need to collect all unique names.
    const nodeSet = new Set<string>();
    note.topics.forEach(t => nodeSet.add(t.name));
    note.relationships.forEach(r => {
      nodeSet.add(r.sourceTopic);
      nodeSet.add(r.targetTopic);
    });

    const nodes = Array.from(nodeSet).map((name) => {
      // make the first node larger (assuming it's main topic)
      return { id: name, name, val: 5 };
    });

    const links = note.relationships.map(r => ({
      source: r.sourceTopic,
      target: r.targetTopic,
      label: r.relationType
    }));

    graphData = { nodes, links };
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/notes")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchNote} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={handleReprocess}
            disabled={isReprocessing || note.status === "processing"}
            className="gap-2"
          >
            {isReprocessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            Reprocess
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-2xl shadow-lg transition-all duration-300">
        <div
          className="h-1 w-full"
          style={{
            background:
              note.status === "completed"
                ? "linear-gradient(90deg, #10b981, #059669)"
                : note.status === "processing"
                ? "linear-gradient(90deg, #3b82f6, #6366f1)"
                : note.status === "failed"
                ? "linear-gradient(90deg, #ef4444, #dc2626)"
                : "linear-gradient(90deg, #f59e0b, #d97706)",
          }}
        />

        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl">
                {note.title}
              </CardTitle>

              <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span>{typeConf.emoji}</span>
                  {typeConf.label}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {format(new Date(note.createdAt), "PPP p")}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(note.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </CardDescription>
            </div>

            <Badge className={`border px-3 py-1 text-sm ${statusConf.className}`}>
              <span className="mr-1.5 inline-flex">{statusConf.icon}</span>
              {statusConf.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{note.wordCount.toLocaleString()} words</span>

            {note.processingStartedAt && (
              <span>
                · Started{" "}
                {formatDistanceToNow(new Date(note.processingStartedAt), {
                  addSuffix: true,
                })}
              </span>
            )}

            {note.processingCompletedAt && (
              <span>
                · Completed{" "}
                {formatDistanceToNow(new Date(note.processingCompletedAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      {(note.status === "pending" || note.status === "processing") && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          AI is processing this note. This page auto-refreshes every few seconds.
        </div>
      )}

      {note.status === "failed" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <X className="h-4 w-4" />
          AI processing failed. You can click Reprocess to try again.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Short Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {note.shortSummary ? (
              <p className="leading-7 text-muted-foreground">
                {note.shortSummary}
              </p>
            ) : (
              <p className="italic text-muted-foreground/60">
                No short summary available yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Detailed Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {note.detailedSummary ? (
              <p className="leading-7 text-muted-foreground">
                {note.detailedSummary}
              </p>
            ) : (
              <p className="italic text-muted-foreground/60">
                No detailed summary available yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Tags
            </CardTitle>
            <CardDescription>
              Searchable labels generated from this note
            </CardDescription>
          </CardHeader>
          <CardContent>
            {note.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="italic text-muted-foreground/60">
                No tags generated yet.
              </p>
            )}
          </CardContent>
        </Card>

      </div>

      {graphData && graphData.nodes.length > 0 && (
        <Card className="col-span-full border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              Knowledge Graph
            </CardTitle>
            <CardDescription>
              Interactive visualization of concepts and their relationships
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[400px]">
            <KnowledgeGraph data={graphData} />
          </CardContent>
        </Card>
      )}

      <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Topics
          </CardTitle>
          <CardDescription>
            Major concepts extracted from this note
          </CardDescription>
        </CardHeader>
        <CardContent>
          {note.topics.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {note.topics.map((topic) => (
                <div key={topic.id} className="rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 bg-white/60 dark:bg-gray-950/40 backdrop-blur-sm p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                  <h3 className="font-semibold">{topic.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {topic.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-muted-foreground/60">
              No topics generated yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Raw Note Content
          </CardTitle>
          <CardDescription>
            Original note text submitted by the user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-950/60 p-6 backdrop-blur-sm">
            <pre className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-muted-foreground">
              {note.rawContent}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}