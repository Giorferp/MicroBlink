import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykzuixwmvpbkgnjedmlv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrenVpeHdtdnBia2duamVkbWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDMzMDUsImV4cCI6MjA5NTcxOTMwNX0.hKq93VtQmZmDsY8p9kG6Iq_JmOOjBKNBvwgQHAzLdrg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);