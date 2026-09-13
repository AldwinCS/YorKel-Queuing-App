import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  Session,
  User,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supaBaseClient";


/* -----------------------------
   TYPES
----------------------------- */

type LoginCredentials = {
  email: string;
  password: string;
};


type AuthData = {
  user: User | null;
  session: Session | null;
};


type AuthResult =
  | {
      success: true;
      data: AuthData;
    }
  | {
      success: false;
      error: string;
    };


type SignOutResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };


type AuthContextType = {
  session: Session | null;

  setSession: Dispatch<
    SetStateAction<Session | null>
  >;

  signUpNewUser: (
    email: string,
    password: string
  ) => Promise<AuthResult>;

  signInUser: (
    credentials: LoginCredentials
  ) => Promise<AuthResult>;

  signOut: () => Promise<SignOutResult>;
};


type AuthContextProviderProps = {
  children: ReactNode;
};


/* -----------------------------
   CONTEXT
----------------------------- */

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


/* -----------------------------
   PROVIDER
----------------------------- */

export const AuthContextProvider = ({
  children,
}: AuthContextProviderProps) => {

  const [session, setSession] =
    useState<Session | null>(null);


  /* -----------------------------
     SIGN UP
  ----------------------------- */

  const signUpNewUser = async (
    email: string,
    password: string
  ): Promise<AuthResult> => {

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });


    if (error) {
      console.error(
        "There was a problem signing up:",
        error
      );

      return {
        success: false,
        error: error.message,
      };
    }


    return {
      success: true,
      data,
    };
  };


  /* -----------------------------
     SIGN IN
  ----------------------------- */

  const signInUser = async ({
    email,
    password,
  }: LoginCredentials): Promise<AuthResult> => {

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });


    if (error) {
      console.error(
        "Sign in error:",
        error
      );

      return {
        success: false,
        error: error.message,
      };
    }


    console.log(
      "Sign in success:",
      data
    );


    return {
      success: true,
      data,
    };
  };


  /* -----------------------------
     SESSION LISTENER
  ----------------------------- */

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {

        setSession(session);

      });


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setSession(session);

      }
    );


    return () => {
      subscription.unsubscribe();
    };

  }, []);


  /* -----------------------------
     SIGN OUT
  ----------------------------- */

  const signOut =
    async (): Promise<SignOutResult> => {

      const { error } =
        await supabase.auth.signOut();


      if (error) {

        console.error(
          "There was an error signing out:",
          error
        );

        return {
          success: false,
          error: error.message,
        };
      }


      return {
        success: true,
      };
    };


  /* -----------------------------
     PROVIDER VALUE
  ----------------------------- */

  return (
    <AuthContext.Provider
      value={{
        session,
        setSession,
        signUpNewUser,
        signInUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


/* -----------------------------
   CUSTOM HOOK
----------------------------- */

export const useAuth = () => {

  const context =
    useContext(AuthContext);


  if (context === undefined) {
    throw new Error(
      "useAuth must be used inside an AuthContextProvider"
    );
  }


  return context;
};