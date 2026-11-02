import { useEffect, useState, type ReactNode } from "react";

import { FunctionsHttpError, type Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supaBaseClient";

import { AuthContext } from "./AuthContext";

import type { LoginCredentials } from "../types/loginCredentials";
import type { AuthResult } from "../types/authResult";
import type { SignOutResult } from "../types/signOutResult";
import type { LoginFunctionResponse } from "../types/loginFunctionResponse";
import type { RegistrationCredentials } from "../types/registrationCredentials";
import { registrationErrorMessage, validateRegistration } from "../lib/registration";

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);

  /*
   * SIGN UP
   */
  const signUpNewUser = async (
    credentials: RegistrationCredentials,
  ): Promise<AuthResult> => {
    const validationError = validateRegistration(credentials);
    if (validationError) {
      return { success: false, error: validationError };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            full_name: credentials.fullName.trim(),
          },
        },
      });

      // Use the same outward result for duplicate and pending-confirmation
      // accounts; never query users or identities to reveal account existence.
      if (error?.code === "user_already_exists" || error?.code === "email_exists") {
        return { success: true, data: { user: null, session: null } };
      }
      if (error) {
        return {
          success: false,
          error: registrationErrorMessage(error.status, error.code),
          status: error.status,
          code: error.code,
        };
      }
      if (!data.user) {
        return { success: false, error: registrationErrorMessage() };
      }
      return { success: true, data };
    } catch {
      return { success: false, error: registrationErrorMessage() };
    }
  };

  /*
   * SIGN IN
   */
  const signInUser = async ({
    email,
    password,
  }: LoginCredentials): Promise<AuthResult> => {
    const { data, error } =
      await supabase.functions.invoke<LoginFunctionResponse>(
        "login-with-rate-limit",
        {
          body: {
            email,
            password,
          },
        },
      );

    /*
     * EDGE FUNCTION RETURNED AN ERROR
     */
    if (error) {
      if (error instanceof FunctionsHttpError) {
        let errorBody: LoginFunctionResponse | null = null;

        try {
          errorBody = await error.context.json();
        } catch {
          console.error("Could not read Edge Function error response.");
        }

        console.error("Login function error:", {
          status: error.context.status,
          body: errorBody,
        });

        return {
          success: false,
          error: errorBody?.error ?? "Login failed.",
          status: error.context.status,
          code: errorBody?.code,
        };
      }

      console.error("Could not reach login function:", error);

      return {
        success: false,
        error: "Unable to connect to the login service.",
      };
    }

    /*
     * CHECK THAT THE FUNCTION RETURNED
     * A VALID SESSION
     */
    if (!data?.success || !data.data?.session) {
      return {
        success: false,
        error: data?.error ?? "Login failed.",
        code: data?.code,
      };
    }

    /*
     * STORE THE SESSION IN THE
     * BROWSER SUPABASE CLIENT
     */
    const { data: sessionData, error: sessionError } =
      await supabase.auth.setSession({
        access_token: data.data.session.access_token,

        refresh_token: data.data.session.refresh_token,
      });

    if (sessionError) {
      console.error("Could not set session:", sessionError);

      return {
        success: false,
        error: "Login succeeded, but the session could not be created.",
        status: sessionError.status,
        code: sessionError.code,
      };
    }

    return {
      success: true,
      data: {
        user: sessionData.user,
        session: sessionData.session,
      },
    };
  };

  /*
   * SESSION LISTENER
   */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /*
   * SIGN OUT
   */
  const signOut = async (): Promise<SignOutResult> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  };

  /*
   * PROVIDER
   */
  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        signInUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
