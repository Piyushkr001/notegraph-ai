"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type NoteStatus = "draft" | "pending" | "processing" | "completed" | "failed";
type NoteType = "study" | "meeting" | "research" | "personal" | "technical";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  NoteStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  draft:      { label: "Draft",      variant: "secondary",    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  pending:    { label: "Pending",    variant: "outline",      className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
  processing: { label: "Processing", variant: "default",      className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 animate-pulse" },
  completed:  { label: "Processed",  variant: "default",      className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800" },
  failed:     { label: "Failed",     variant: "destructive",  className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
};

const TYPE_CONFIG: Record<NoteType, { label: string; emoji: string }> = {
  study:     { label: "Study",     emoji: "📚" },
  meeting:   { label: "Meeting",   emoji: "🤝" },
  research:  { label: "Research",  emoji: "🔬" },
  personal:  { label: "Personal",  emoji: "✍️" },
  technical: { label: "Technical", emoji: "⚙️" },
};

const NOTE_TYPES: NoteType[] = ["study", "meeting", "research", "personal", "technical"];
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function NoteCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/4 mt-1" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: Note;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string, title: string) => void;
}

function NoteCard({ note, onArchive, onDelete }: NoteCardProps) {
  const typeConf = TYPE_CONFIG[note.noteType] ?? { label: note.noteType, emoji: "📝" };
  const statusConf = STATUS_CONFIG[note.status] ?? STATUS_CONFIG.draft;

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30">
      {/* Subtle top accent per type */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{
          background:
            note.status === "completed"
              ? "linear-gradient(90deg, #10b981, #059669)"
              : note.status === "processing"
              ? "linear-gradient(90deg, #3b82f6, #6366f1)"
              : note.status === "failed"
              ? "linear-gradient(90deg, #ef4444, #dc2626)"
              : "linear-gradient(90deg, #94a3b8, #64748b)",
        }}
      />

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {note.title}
          </CardTitle>
          <Badge className={`shrink-0 text-xs px-2 py-0.5 border ${statusConf.className}`}>
            {statusConf.label}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
          <span>{typeConf.emoji}</span>
          <span>{typeConf.label}</span>
          <span className="text-muted-foreground/40">·</span>
          <Clock className="h-3 w-3 text-muted-foreground/60" />
          <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {note.shortSummary ? (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {note.shortSummary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/50 italic mb-3">
            No summary yet — awaiting AI processing.
          </p>
        )}

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {note.tags.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                +{note.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/60">
            {note.wordCount.toLocaleString()} words
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

// ─── Create Note Dialog ───────────────────────────────────────────────────────

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

function CreateNoteDialog({ open, onOpenChange, onCreated }: CreateNoteDialogProps) {
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
      const res = await fetch("/api/dashboard/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, rawContent, noteType }),
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Failed to create note");
        return;
      }

      toast.success("Note created successfully!");
      setTitle("");
      setRawContent("");
      setNoteType("personal");
      onOpenChange(false);
      onCreated();
    } catch {
      toast.error("Something went wrong. Please try again.");
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
            Add a note to your workspace. NoteGraph AI will analyze it and generate topics, tags, and relationships.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
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
                onValueChange={(v) => { if (v) setNoteType(v as NoteType); }}
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
              <span className="text-xs text-muted-foreground">{wordCount} words</span>
            </div>
            <Textarea
              id="note-content"
              placeholder="Paste or write your note content here. The AI will process it to extract key topics, tags, and knowledge relationships…"
              className="min-h-[200px] text-sm leading-relaxed resize-y"
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
            <Button type="submit" disabled={isSubmitting || !title.trim() || !rawContent.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
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

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

interface DeleteDialogProps {
  noteId: string | null;
  noteTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function DeleteDialog({ noteId, noteTitle, onCancel, onConfirm, isDeleting }: DeleteDialogProps) {
  return (
    <Dialog open={!!noteId} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Note
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-foreground">"{noteTitle}"</span>? This action cannot
            be undone and all associated topics, tags, and relationships will also be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting…
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

// ─── Main Page ────────────────────────────────────────────────────────────────

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

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
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

      const res = await fetch(`/api/dashboard/notes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const json = await res.json();
      setNotes(json.notes);
      setPagination(json.pagination);
    } catch {
      toast.error("Failed to load notes. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, typeFilter, showArchived]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  async function handleArchive(id: string, archive: boolean) {
    try {
      const res = await fetch("/api/dashboard/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isArchived: archive }),
      });
      if (!res.ok) throw new Error();
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
      const res = await fetch(`/api/dashboard/notes?id=${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Note deleted");
      setDeleteTarget(null);
      if (notes.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchNotes();
    } catch {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  }

  const hasActiveFilters =
    debouncedSearch || statusFilter !== "all" || typeFilter !== "all" || showArchived;

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setShowArchived(false);
    setPage(1);
  }

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            My Notes
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {pagination.total > 0
              ? `${pagination.total} note${pagination.total === 1 ? "" : "s"} in your workspace`
              : "Your personal AI-powered knowledge base"}
          </p>
        </div>
        <Button
          id="create-note-btn"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="notes-search"
            placeholder="Search notes…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => { setSearch(""); setDebouncedSearch(""); }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v ?? "all"); setPage(1); }}>
          <SelectTrigger id="status-filter" className="w-[150px]">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v ?? "all"); setPage(1); }}>
          <SelectTrigger id="type-filter" className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_FILTERS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          id="archived-toggle"
          variant={showArchived ? "secondary" : "outline"}
          size="sm"
          className="gap-1.5"
          onClick={() => { setShowArchived((p) => !p); setPage(1); }}
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

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <NoteCardSkeleton key={i} />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {hasActiveFilters ? "No notes match your filters" : showArchived ? "No archived notes" : "No notes yet"}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Create your first note to get started with AI-powered knowledge management."}
            </p>
          </div>
          {!hasActiveFilters && !showArchived && (
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 mt-2">
              <Plus className="h-4 w-4" />
              Create your first note
            </Button>
          )}
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="gap-2 mt-2">
              <X className="h-4 w-4" />
              Clear filters
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
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.pageSize + 1}–
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span> notes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  id="prev-page-btn"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  id="next-page-btn"
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

      {/* Dialogs */}
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
