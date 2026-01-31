
console.log("supabase starts");

export const supabaseUrl = 'https://fwsippjsgqiyapxtvtol.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3c2lwcGpzZ3FpeWFweHR2dG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTcwODYsImV4cCI6MjA4NTM5MzA4Nn0.WuMPOd-cN6T6d7oCW9sM8k3U8SmVZ1OemhqjluYUzHg';

// This creates the connection
export const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
console.log("Supabase is connected:", supabase);
