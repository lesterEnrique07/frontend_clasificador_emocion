import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oahwbkkseydjfdiuphnh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haHdia2tzZXlkamZkaXVwaG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcyMDAyOTcsImV4cCI6MjA0Mjc3NjI5N30.aLb8cVlTAjl_HFkt345nCaZMBe9gBuOzzTm4R6-yiRo'

export const supabase = createClient(supabaseUrl, supabaseKey)