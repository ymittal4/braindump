import { createClient } from "@supabase/supabase-js";


const supaBaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supaBaseAnon = process.env.REACT_APP_SUPABASE_ANON;

if (!supaBaseUrl || !supaBaseAnon) {
    throw new Error("Supabase credentials not available");
}

export const supabase = createClient(supaBaseUrl, supaBaseAnon);