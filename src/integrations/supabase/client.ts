// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jxyicddkvfhcijxirulk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4eWljZGRrdmZoY2lqeGlydWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTkzMTAsImV4cCI6MjA1MDUzNTMxMH0.679MwVHAlAD7nGCS3Vayr8l5VGrYxeZ4P7yWNOWmEGE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);