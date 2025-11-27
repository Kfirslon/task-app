import { Brain, Clock, TrendingUp, Sparkles, Waves, Lightbulb } from "lucide-react";

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
    high: "bg-red-100 text-red-800 border-red-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/50 via-transparent to-cyan-400/50"></div>
      
      <div className="relative p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-bold text-white drop-shadow-lg flex items-center gap-2">
                AI Insights
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              </span>
              <p className="text-xs text-blue-100">Powered by OpenAI</p>
            </div>
          </div>
          <Waves className="w-6 h-6 text-white/60" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {priority && (
            <div className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold border-2 shadow-lg backdrop-blur-sm ${priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium}`}>
              <TrendingUp className="w-3 h-3" />
              <span>{priority.toUpperCase()} Priority</span>
            </div>
          )}
          
          {estimatedTime && (
            <div className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold bg-white text-blue-700 shadow-lg">
              <Clock className="w-3 h-3" />
              <span>{estimatedTime} minutes</span>
            </div>
          )}
        </div>

        {aiInsights?.suggestion && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border-2 border-white/50">
            <div className="text-sm text-gray-800 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-blue-600 text-xs mb-1">AI Suggestion</p>
                <p className="font-medium">{aiInsights.suggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}