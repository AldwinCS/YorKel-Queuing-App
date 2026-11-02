import type { AuthData } from "./authData";

export type LoginFunctionResponse = {
  success: boolean;
  data?: AuthData;
  error?: string;
  code?: string;
  retryAfterSeconds?: number;
};
