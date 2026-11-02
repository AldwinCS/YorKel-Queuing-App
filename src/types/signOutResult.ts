export type SignOutResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };
