import type { AuthData } from "./authData";

export type AuthResult =
  | {
      success: true;
      data: AuthData;
    }
  | {
      success: false;
      error: string;
      status?: number;
      code?: string;
    };
