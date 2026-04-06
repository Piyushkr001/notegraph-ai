"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
  Tag,
  Share2,
  List,
  Info,
  Clock,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityEvent {
  id: string;
  userId: string;
  noteId: string | null;
  activityType: string;
  title: string;
  description: string | null;
  metadata: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const getActivityIcon = (type: string) => {
  if (type.includes("note")) return <FileText className="h-4 w-4" />;
  if (type.includes("topic")) return <List className="h-4 w-4" />;
  if (type.includes("tag")) return <Tag className="h-4 w-4" />;
  if (type.includes("relationship")) return <Share2 className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
};

const getActivityColor = (type: string) => {
  if (type.includes("started")) return "text-blue-500 bg-blue-50 dark:bg-blue-950 dark:text-blue-400";
  if (type.includes("completed") || type.includes("generated") || type.includes("created"))
    return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400";
  if (type.includes("failed") || type.includes("deleted"))
    return "text-red-500 bg-red-50 dark:bg-red-950 dark:text-red-400";
  if (type.includes("updated")) return "text-amber-500 bg-amber-50 dark:bg-amber-950 dark:text-amber-400";
  return "text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400";
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (typeFilter !== "all") params.set("type", typeFilter);

      const { data } = await axios.get(`/api/dashboard/activity?${params.toString()}`);
      
      setActivities(data.activities);
      setPagination(data.pagination);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || 
        "Failed to load activity events"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, typeFilter]);

  return (
    <div className="flex flex-1 flex-col space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground mt-1">
            Track everything happening in your workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val || "all"); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="note_created">Note Created</SelectItem>
              <SelectItem value="note_processing_started">Processing Started</SelectItem>
              <SelectItem value="note_processing_completed">Processing Completed</SelectItem>
              <SelectItem value="topics_generated">Topics Generated</SelectItem>
              <SelectItem value="tags_generated">Tags Generated</SelectItem>
              <SelectItem value="relationships_generated">Relationships Generated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b px-6 py-4">
          <CardTitle>Event History</CardTitle>
          <CardDescription>
            {pagination?.total ? `${pagination.total} total events` : "Loading events..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 p-6">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="space-y-2 flex-col flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3 p-8 text-center bg-muted/20">
              <div className="rounded-full bg-muted p-4">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No activity found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                There are no events matching your current filters.
              </p>
              {typeFilter !== "all" && (
                <Button variant="outline" onClick={() => setTypeFilter("all")} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border/50 hidden md:block" />
              {activities.map((activity) => {
                const colorClass = getActivityColor(activity.activityType);
                let metadataObj = null;
                try {
                  if (activity.metadata) metadataObj = JSON.parse(activity.metadata);
                } catch (e) {}

                return (
                  <div
                    key={activity.id}
                    className="group flex flex-col md:flex-row gap-4 p-4 md:p-6 transition-colors hover:bg-muted/30 relative"
                  >
                    <div className="flex shrink-0 z-10">
                      <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm ${colorClass}`}>
                        {getActivityIcon(activity.activityType)}
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="font-semibold text-base">{activity.title}</div>
                        <div className="flex items-center text-xs text-muted-foreground pt-1 gap-1 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-3xl">
                        {activity.description}
                      </p>
                      {metadataObj && Object.keys(metadataObj).length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                            {Object.entries(metadataObj).map(([k, v]) => (
                                <Badge key={k} variant="secondary" className="text-xs font-normal">
                                    <span className="opacity-60 mr-1 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                    {String(v)}
                                </Badge>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="border-t px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground hidden sm:block">
              Showing page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <p className="text-sm text-muted-foreground sm:hidden tracking-wide text-center">
                {pagination.page} / {pagination.totalPages}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
