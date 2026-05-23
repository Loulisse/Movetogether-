import { createClient } from '@supabase/supabase-js'

// Les clés sont lues depuis les variables d'environnement Vercel
// (voir README.md pour comment les configurer)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'COLLE_TON_URL_ICI'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'COLLE_TA_CLE_ICI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const PHOTOS_BUCKET = 'photos'