import type { Session, User } from "@supabase/supabase-js";

export type AuthData = {
  user: User | null;
  session: Session | null;
};
