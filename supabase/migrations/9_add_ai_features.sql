-- Add AI-powered fields to tasks table
ALTER TABLE public.tasks 
ADD COLUMN priority text check (priority in ('high', 'medium', 'low')),
ADD COLUMN estimated_time integer, -- in minutes
ADD COLUMN ai_insights jsonb;

-- Create index for priority queries
CREATE INDEX idx_tasks_priority ON public.tasks(priority);

-- Add comment
COMMENT ON COLUMN public.tasks.priority IS 'AI-suggested priority level';
COMMENT ON COLUMN public.tasks.estimated_time IS 'AI-estimated completion time in minutes';
COMMENT ON COLUMN public.tasks.ai_insights IS 'JSON with AI analysis and suggestions';
