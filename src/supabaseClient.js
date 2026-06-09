/*
  Este arquivo configura e exporta o cliente do Supabase.
  - Utiliza variáveis de ambiente para segurança.
  - Cria uma instância única do Supabase para toda a aplicação.
*/

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY


export const supabase = createClient(supabaseUrl, supabaseAnonKey)