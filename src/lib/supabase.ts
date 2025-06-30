import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://uhjwmoavyylhxnxspwel.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoandtb2F2eXlsaHhueHNwd2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTYwODksImV4cCI6MjA2NjU3MjA4OX0.K2h9zjpzUw_ySWQf5Nktq3N9oTNtsRjaNYywahmGow8';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };