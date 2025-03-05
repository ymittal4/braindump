import { createClient } from "@supabase/supabase-js";

const supaBaseUrl = process.env.REACT_APP_SUPABASE_URL
const supaBaseAnon = process.env.SUPABASE_ANON

export const createConnection = () => {
    if ( !supaBaseUrl || !supaBaseAnon ) {
        throw new Error ("supabase creds not available")
    }
    else {
        createClient(supaBaseUrl, supaBaseAnon)
    }
}