"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { BarChart3, CheckCircle2, Clock, TrendingUp, Zap } from "lucide-react";

interface TaskStats {
  total: number;
  completed: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  totalEstimatedTime: number;
  completionRate: number;
}

export function TaskAnalyticsDashboard() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);

    if (tasks) {
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      
      const stats: TaskStats = {
        total,
        completed,
        byPriority: {
          high: tasks.filter(t => t.priority === "high").length,
          medium: tasks.filter(t => t.priority === "medium").length,
          low: tasks.filter(t => t.priority === "low").length,
        },
        totalEstimatedTime: tasks
          .filter(t => !t.completed && t.estimated_time)
          .reduce((sum, t) => sum + (t.estimated_time || 0), 0),
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };

      setStats(stats);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        Your Task Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <Zap className="w-10 h-10 opacity-80" />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completion</p>
              <p className="text-3xl font-bold mt-1">{stats.completionRate}%</p>
            </div>
            <CheckCircle2 className="w-10 h-10 opacity-80" />
          </div>
          <div className="mt-2 text-xs text-green-100">
            {stats.completed} of {stats.total} tasks done
          </div>
        </div>

        {/* Estimated Time */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Time Left</p>
              <p className="text-3xl font-bold mt-1">
                {Math.round(stats.totalEstimatedTime / 60)}h
              </p>
            </div>
            <Clock className="w-10 h-10 opacity-80" />
          </div>
          <div className="mt-2 text-xs text-orange-100">
            {stats.totalEstimatedTime} minutes remaining
          </div>
        </div>

        {/* High Priority */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">High Priority</p>
              <p className="text-3xl font-bold mt-1">{stats.byPriority.high}</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
          <div className="mt-2 text-xs text-red-100">
            {stats.byPriority.medium} medium, {stats.byPriority.low} low
          </div>
        </div>
      </div>
    </div>
  );
}
