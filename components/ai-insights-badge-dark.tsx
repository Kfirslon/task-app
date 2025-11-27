import { Brain, Clock, TrendingUp, Sparkles, Zap, Lightbulb } from "lucide-react";

interface AIInsights {
  suggestion?: string;
  analyzed_at?: string;
  confidence?: string;
}

interface AIInsightsBadgeDarkProps {
  priority?: string | null;
  estimatedTime?: number | null;
  aiInsights?: any; // Accept Json type from Supabase
}

export function AIInsightsBadgeDark({ priority, estimatedTime, aiInsights }: AIInsightsBadgeDarkProps) {    
  if (!priority && !estimatedTime && !aiInsights) return null;

  // Cast to our expected type
  const insights = aiInsights as AIInsights | null;

  const priorityColors = {
    high: "bg-red-900/50 text-red-200 border-red-500",
    medium: "bg-yellow-900/50 text-yellow-200 border-yellow-500",
    low: "bg-green-900/50 text-green-200 border-green-500",
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-4 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10"></div>
      
      <div className="relative p-5 space-y-4 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800/90 rounded-xl shadow-lg backdrop-blur-sm border border-slate-600">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 drop-shadow-lg flex items-center gap-2">
              AI Analysis
              <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priority && (
            <div className={`rounded-xl p-4 ${priorityColors[priority as keyof typeof priorityColors] || priorityColors.medium} border-2 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-transform`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold text-sm">Priority</span>
              </div>
              <p className="text-lg font-bold capitalize">{priority}</p>
            </div>
          )}

          {estimatedTime && (
            <div className="rounded-xl p-4 bg-slate-800/90 border-2 border-blue-500 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-2 text-blue-300">
                <Clock className="h-5 w-5" />
                <span className="font-semibold text-sm">Estimated Time</span>
              </div>
              <p className="text-lg font-bold text-blue-200">{estimatedTime} minutes</p>
            </div>
          )}

          {insights?.suggestion && (
            <div className="rounded-xl p-4 bg-slate-800/90 border-2 border-purple-500 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-transform md:col-span-1">
              <div className="flex items-center gap-2 mb-2 text-purple-300">
                <Lightbulb className="h-5 w-5" />
                <span className="font-semibold text-sm">AI Suggestion</span>
              </div>
              <p className="text-sm text-purple-200 leading-relaxed">{insights.suggestion}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs pt-2 border-t border-slate-700">
          <Zap className="h-4 w-4" />
          <span>Powered by AI • Analysis confidence: {insights?.confidence || 'High'}</span>
        </div>
      </div>
    </div>
  );
}
