"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Archive,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Loader2,
  Sparkles,
  Tag,
  Clock,
  RefreshCcw,
  Brain,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";



type NoteStatus = "draft" | "pending" | "processing" | "completed" | "failed";
type NoteType =
  | "study"
  | "meeting"
  | "research"
  | "personal"
  | "technical";

interface Note {
  id: string;
  title: string;
  noteType: NoteType;
  status: NoteStatus;
  shortSummary: string | null;
  wordCount: number;
  isArchived: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  processingCompletedAt: string | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

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

const NOTE_TYPES: NoteType[] = [
  "study",
  "meeting",
  "research",
  "personal",
  "technical",
];

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Processed" },
  { value: "failed", label: "Failed" },
];

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All Types" },
  ...NOTE_TYPES.map((t) => ({ value: t, label: TYPE_CONFIG[t].label })),
];

function NoteCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-1 h-4 w-1/4" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="mb-2 h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

interface NoteCardProps {
  note: Note;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string, title: string) => void;
  onReprocess: (id: string) => void;
  processingIds: Set<string>;
}

function NoteCard({
  note,
  onArchive,
  onDelete,
  onReprocess,
  processingIds,
}: NoteCardProps) {
  const typeConf = TYPE_CONFIG[note.noteType] ?? {
    label: note.noteType,
    emoji: "📝",
  };
  const statusConf = STATUS_CONFIG[note.status] ?? STATUS_CONFIG.draft;
  const isReprocessing = processingIds.has(note.id);

  const canReprocess =
    note.status === "failed" ||
    note.status === "pending" ||
    note.status === "completed";

  return (
    <Card className="group relative overflow-hidden border transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      <div
        className="absolute left-0 right-0 top-0 h-0.5 opacity-70"
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

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2 text-base font-semibold leading-tight transition-colors group-hover:text-primary">
            <Link href={`/dashboard/notes/${note.id}`} className="hover:text-primary">
              {note.title}
            </Link>
          </CardTitle>

          <Badge
            className={`shrink-0 border px-2 py-0.5 text-xs ${statusConf.className}`}
          >
            <span className="mr-1 inline-flex">{statusConf.icon}</span>
            {statusConf.label}
          </Badge>
        </div>

        <CardDescription className="mt-1 flex items-center gap-1.5 text-xs">
          <span>{typeConf.emoji}</span>
          <span>{typeConf.label}</span>
          <span className="text-muted-foreground/40">·</span>
          <Clock className="h-3 w-3 text-muted-foreground/60" />
          <span>
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3 pt-0">
        {note.shortSummary ? (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {note.shortSummary}
          </p>
        ) : note.status === "processing" ? (
          <div className="mb-3 flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI is analyzing this note...
          </div>
        ) : note.status === "pending" ? (
          <div className="mb-3 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <Clock className="h-4 w-4" />
            Waiting to start processing...
          </div>
        ) : note.status === "failed" ? (
          <div className="mb-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <X className="h-4 w-4" />
            AI processing failed. Try reprocessing.
          </div>
        ) : (
          <p className="mb-3 italic text-sm text-muted-foreground/50">
            No summary available.
          </p>
        )}

        {note.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {note.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {note.tags.length > 4 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                +{note.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/60">
            {note.wordCount.toLocaleString()} words
          </span>

          <div className="flex items-center gap-1 opacity-100 md:opacity-0 transition-opacity md:group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="h-7 w-7" title="View note">
              <Link href={`/dashboard/notes/${note.id}`}>
                <FileText className="h-3.5 w-3.5" />
              </Link>
            </Button>

            {canReprocess && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                title="Reprocess note"
                onClick={() => onReprocess(note.id)}
                disabled={isReprocessing || note.status === "processing"}
              >
                {isReprocessing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Brain className="h-3.5 w-3.5" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title={note.isArchived ? "Restore note" : "Archive note"}
              onClick={() => onArchive(note.id, !note.isArchived)}
            >
              {note.isArchived ? (
                <RotateCcw className="h-3.5 w-3.5" />
              ) : (
                <Archive className="h-3.5 w-3.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              title="Delete note"
              onClick={() => onDelete(note.id, note.title)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

function CreateNoteDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateNoteDialogProps) {
  const [title, setTitle] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [noteType, setNoteType] = useState<NoteType>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = rawContent.trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !rawContent.trim()) return;

    setIsSubmitting(true);

    try {
      await axios.post("/api/dashboard/notes", {
        title,
        rawContent,
        noteType,
      });

      toast.success("Note created and AI processing started");

      setTitle("");
      setRawContent("");
      setNoteType("personal");
      onOpenChange(false);
      onCreated();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data ||
          "Failed to create note"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Note
          </DialogTitle>
          <DialogDescription>
            Add a note to your workspace. NoteGraph AI will analyze it and
            generate summaries, topics, tags, and relationships.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                placeholder="e.g. Meeting notes for Q1 planning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note-type">Type</Label>
              <Select
                value={noteType}
                onValueChange={(v) => {
                  if (v) setNoteType(v as NoteType);
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="note-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_CONFIG[t].emoji} {TYPE_CONFIG[t].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="note-content">Content</Label>
              <span className="text-xs text-muted-foreground">
                {wordCount} words
              </span>
            </div>
            <Textarea
              id="note-content"
              placeholder="Paste or write your note content here..."
              className="min-h-[200px] resize-y text-sm leading-relaxed"
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !rawContent.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteDialogProps {
  noteId: string | null;
  noteTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function DeleteDialog({
  noteId,
  noteTitle,
  onCancel,
  onConfirm,
  isDeleting,
}: DeleteDialogProps) {
  return (
    <Dialog open={!!noteId} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Note
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-foreground">
              "{noteTitle}"
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "12",
        archived: String(showArchived),
      });

      if (debouncedSearch) params.set("q", debouncedSearch);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("noteType", typeFilter);

      const { data } = await axios.get(`/api/dashboard/notes?${params.toString()}`);
      setNotes(data.notes);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load notes. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, typeFilter, showArchived]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const hasLiveProcessing = notes.some(
      (note) => note.status === "pending" || note.status === "processing"
    );

    if (!hasLiveProcessing) return;

    const interval = setInterval(() => {
      fetchNotes();
    }, 4000);

    return () => clearInterval(interval);
  }, [notes, fetchNotes]);

  async function handleArchive(id: string, archive: boolean) {
    try {
      await axios.patch("/api/dashboard/notes", {
        id,
        isArchived: archive,
      });

      toast.success(archive ? "Note archived" : "Note restored");
      fetchNotes();
    } catch {
      toast.error("Failed to update note");
    }
  }

  function handleDeleteRequest(id: string, title: string) {
    setDeleteTarget({ id, title });
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      await axios.delete(`/api/dashboard/notes?id=${deleteTarget.id}`);
      toast.success("Note deleted");
      setDeleteTarget(null);

      if (notes.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchNotes();
      }
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleReprocess(noteId: string) {
    setProcessingIds((prev) => new Set(prev).add(noteId));

    try {
      await axios.post("/api/dashboard/notes/process", { noteId });
      toast.success("AI processing completed");
      fetchNotes();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to reprocess note"
      );
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
    }
  }

  const hasActiveFilters =
    !!debouncedSearch ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    showArchived;

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setShowArchived(false);
    setPage(1);
  }

  const liveCount = notes.filter(
    (note) => note.status === "pending" || note.status === "processing"
  ).length;

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <BookOpen className="h-7 w-7 text-primary" />
            My Notes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pagination.total > 0
              ? `${pagination.total} note${pagination.total === 1 ? "" : "s"} in your workspace`
              : "Your personal AI-powered knowledge base"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchNotes} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>

          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {liveCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          {liveCount} note{liveCount === 1 ? "" : "s"} currently processing.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_FILTERS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showArchived ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setShowArchived((p) => !p);
            setPage(1);
          }}
        >
          <Archive className="h-3.5 w-3.5" />
          {showArchived ? "Showing Archived" : "Archived"}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-24 text-center">
          <div className="rounded-full bg-muted p-6">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              {hasActiveFilters
                ? "No notes match your filters"
                : showArchived
                ? "No archived notes"
                : "No notes yet"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Create your first note to get started with AI-powered knowledge management."}
            </p>
          </div>

          {!hasActiveFilters && !showArchived && (
            <Button onClick={() => setIsCreateOpen(true)} className="mt-2 gap-2">
              <Plus className="h-4 w-4" />
              Create your first note
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onArchive={handleArchive}
                onDelete={handleDeleteRequest}
                onReprocess={handleReprocess}
                processingIds={processingIds}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.pageSize + 1}–
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span> notes
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="px-2 text-sm font-medium">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <CreateNoteDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreated={fetchNotes}
      />

      <DeleteDialog
        noteId={deleteTarget?.id ?? null}
        noteTitle={deleteTarget?.title ?? ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}