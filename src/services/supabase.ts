import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bshveqddeptclszvvcsl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaHZlcWRkZXB0Y2xzenZ2Y3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MzQ3MTYsImV4cCI6MjA5ODIxMDcxNn0._yzuTdCnK-CS07NYqTC3i9qMRyPzVZ4sfNuVh3yq7yY';

export const supabase = createClient(supabaseUrl, supabaseKey);
