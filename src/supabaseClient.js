import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://toeuopozwdybeteooirz.supabase.co"
const supabaseKey = "sb_publishable_Xp4zrc32ZpU5ABY1BP2MQg_5eGReZLs"

export const supabase = createClient(supabaseUrl, supabaseKey)

