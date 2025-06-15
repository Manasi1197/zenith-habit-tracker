
-- Create a table for user habits
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  streak INTEGER NOT NULL DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own habits
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own habits
CREATE POLICY "Users can view their own habits" 
  ON public.habits 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own habits
CREATE POLICY "Users can create their own habits" 
  ON public.habits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own habits
CREATE POLICY "Users can update their own habits" 
  ON public.habits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own habits
CREATE POLICY "Users can delete their own habits" 
  ON public.habits 
  FOR DELETE 
  USING (auth.uid() = user_id);
