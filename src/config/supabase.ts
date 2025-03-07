import { createClient } from "@supabase/supabase-js";


export const supabase = () => {

    const supaBaseUrl = process.env.REACT_APP_SUPABASE_URL
    const supaBaseAnon = process.env.REACT_APP_SUPABASE_ANON

    if ( !supaBaseUrl || !supaBaseAnon ) {
        throw new Error ("supabase creds not available")
    }
    else {
        return createClient(supaBaseUrl, supaBaseAnon)
    }
    
}