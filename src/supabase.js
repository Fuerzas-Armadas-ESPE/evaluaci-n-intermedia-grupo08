import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://pxnxkyedaraioiulysrm.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bnhreWVkYXJhaW9pdWx5c3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MTI0MTAsImV4cCI6MjAyNTE4ODQxMH0.le30Q8u952yOAQ1uRn7yPzOJiS-wxcmbauvPrFIERCM"
);