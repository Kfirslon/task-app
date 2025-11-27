import { Brain, Clock, TrendingUp, Sparkles, Waves, Lightbulb } from "lucide-react";

interface AIInsightsBadgeProps {
  priority?: string | null;
  estimatedTime?: number | null;
  aiInsights?: {
    suggestion?: string;
    analyzed_at?: string;
    confidence?: string;
  } | null;
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
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-white drop-shadow-lg flex items-center gap-2">
              AI Analysis
              <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priority && (
            <div className={`rounded-xl p-4 ${priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium} border-2 backdrop-blur-sm bg-white/90 shadow-xl transform hover:scale-105 transition-transform`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold text-sm">Priority</span>
              </div>
              <p className="text-lg font-bold capitalize">{priority}</p>
            </div>
          )}

          {estimatedTime && (
            <div className="rounded-xl p-4 bg-white/90 border-2 border-blue-300 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-2 text-blue-800">
                <Clock className="h-5 w-5" />
                <span className="font-semibold text-sm">Estimated Time</span>
              </div>
              <p className="text-lg font-bold text-blue-900">{estimatedTime} minutes</p>
            </div>
          )}

          {aiInsights?.suggestion && (
            <div className="rounded-xl p-4 bg-white/90 border-2 border-cyan-300 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-transform md:col-span-1">
              <div className="flex items-center gap-2 mb-2 text-cyan-800">
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold text-sm">AI Suggestion</span>
              </div>
              <p className="text-sm text-cyan-900 leading-relaxed">{aiInsights.suggestion}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-white/80 text-xs pt-2 border-t border-white/20">
          <Waves className="h-4 w-4" />
          <span>Powered by AI • Analysis confidence: {aiInsights?.confidence || 'High'}</span>
        </div>
      </div>
    </div>
  );
}
