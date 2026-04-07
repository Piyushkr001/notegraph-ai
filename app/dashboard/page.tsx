"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Tags, CheckCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardData {
  totalNotes: number;
  totalTopics: number;
  statusStats: { status: string; count: number }[];
  recentActivity: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mt-2 h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
               <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Error Loading Dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  // Derive counts
  const completedNotes = data.statusStats.find(s => s.status === 'completed')?.count || 0;
  const pendingNotes = data.statusStats.find(s => s.status === 'pending' || s.status === 'processing')?.count || 0;

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between space-y-2 mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mix-blend-normal">
          Overview.
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-700 relative group">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">{data.totalNotes}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Total notes in your workspace
            </p>
          </CardContent>
        </Card>
        <Card className="border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-700 relative group">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
            <Tags className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">{data.totalTopics}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Generated topics from processing
            </p>
          </CardContent>
        </Card>
        <Card className="border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-emerald-300 dark:hover:border-emerald-700 relative group">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Processed Notes</CardTitle>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">{completedNotes}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Successfully analyzed
            </p>
          </CardContent>
        </Card>
        <Card className="border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-300 dark:hover:border-amber-700 relative group">
           <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Pending Analysis</CardTitle>
            <Clock className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold tracking-tight">{pendingNotes}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Awaiting or currently processing
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-10">
        <Card className="col-span-4 border overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription className="text-sm">
              Your latest interactions and system events.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-6 pr-6">
            <div className="space-y-6">
              {data.recentActivity.length === 0 ? (
                <div className="text-sm text-muted-foreground italic py-4">
                  No recent activity found.
                </div>
              ) : (
                <div className="relative border-l border-indigo-100 dark:border-indigo-900/50 pl-6 ml-2 space-y-8">
                  {data.recentActivity.map((activity) => (
                    <div key={activity.id} className="relative group">
                      <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 ring-4 ring-white dark:ring-gray-900">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 group-hover:scale-125 transition-transform" />
                      </span>
                      <div className="space-y-1 bg-white/50 dark:bg-gray-950/30 p-4 rounded-xl border border-indigo-50 dark:border-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                        <p className="text-sm font-semibold leading-none text-gray-900 dark:text-gray-100">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {activity.description}
                        </p>
                        <p className="text-xs font-medium text-indigo-500/80 pt-1">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
