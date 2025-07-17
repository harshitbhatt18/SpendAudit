import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xeslmginasjkqplvsgyg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc2xtZ2luYXNqa3FwbHZzZ3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjMwMTYsImV4cCI6MjA2NjU5OTAxNn0.UN7hq2OrR-xRvpI87DyLSSUy54PUAGsiQ6N-4E4JESQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)