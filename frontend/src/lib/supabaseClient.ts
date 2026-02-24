import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  // 런타임에서 바로 원인 파악 가능하도록 명시적으로 에러를 던진다.
  throw new Error("Supabase env가 누락됐어. NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해.");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
