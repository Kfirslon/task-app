import { Brain, Clock, TrendingUp, Zap } from "lucide-react";

interface AIInsightsBadgeProps {
  priority?: string;
  estimatedTime?: number;
  aiInsights?: {
    suggestion?: string;
    analyzed_at?: string;
    confidence?: string;
  };
}

export function AIInsightsBadge({ priority, estimatedTime, aiInsights }: AIInsightsBadgeProps) {
  if (!priority && !estimatedTime && !aiInsights) return null;

  const priorityColors = {
    high: "bg-red-500/20 text-red-300 border-red-500/50",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    low: "bg-green-500/20 text-green-300 border-green-500/50",
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 p-4 shadow-2xl shadow-cyan-500/20">
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl"></div>
      
      {/* Content */}
      <div className="relative space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI POWERED INSIGHTS
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {priority && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium}`}>
              <TrendingUp className="w-3 h-3" />
              <span>{priority.toUpperCase()}</span>
            </div>
          )}
          
          {estimatedTime && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
              <Clock className="w-3 h-3" />
              <span>{estimatedTime} MIN</span>
            </div>
          )}
        </div>

        {aiInsights?.suggestion && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30">
            <div className="text-xs text-gray-300 flex items-start gap-2">
              <span className="text-lg">í²¡</span>
              <span className="flex-1">{aiInsights.suggestion}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
