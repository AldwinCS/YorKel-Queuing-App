import type { Session } from "@supabase/supabase-js";

import type { LoginCredentials } from "./loginCredentials";
import type { AuthResult } from "./authResult";
import type { SignOutResult } from "./signOutResult";
import type { RegistrationCredentials } from "./registrationCredentials";

export type AuthContextType = {
  session: Session | null;

  signUpNewUser: (credentials: RegistrationCredentials) => Promise<AuthResult>;

  signInUser: (credentials: LoginCredentials) => Promise<AuthResult>;

  signOut: () => Promise<SignOutResult>;
};
