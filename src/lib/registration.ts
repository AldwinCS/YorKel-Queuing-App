import type { RegistrationCredentials } from "../types/registrationCredentials";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const CONFIRMATION_MESSAGE =
  "If this address is eligible, you will receive a confirmation email. Check your inbox and spam folder. If you already have an account, log in instead.";

// These checks improve UX. Supabase Auth must enforce the password policy too.
export function validateRegistration(values: RegistrationCredentials): string | null {
  const name = values.fullName.trim();
  const hasControlCharacters = Array.from(name).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
  if (name.length < 2 || name.length > 80 || hasControlCharacters) {
    return "Enter a name between 2 and 80 characters without control characters.";
  }
  const email = values.email.trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }
  // Do not trim or otherwise change passwords, including spaces.
  if (values.password.length < MIN_PASSWORD_LENGTH || values.password.length > MAX_PASSWORD_LENGTH) {
    return `Use a password between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`;
  }
  if (!/[a-z]/.test(values.password) || !/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    return "Include an uppercase letter, a lowercase letter, and a number in your password.";
  }
  return null;
}

export function registrationErrorMessage(status?: number, code?: string): string {
  if (status === 429 || code === "over_email_send_rate_limit" || code === "over_request_rate_limit") {
    return "Too many registration attempts. Please wait a few minutes before trying again.";
  }
  if (code === "weak_password") {
    return `Choose a stronger password. Use at least ${MIN_PASSWORD_LENGTH} characters with uppercase and lowercase letters and a number; avoid common or leaked passwords.`;
  }
  if (code === "email_address_invalid" || code === "validation_failed" || code === "email_address_not_authorized") {
    return "We could not register with those details. Check your email address and try again.";
  }
  if (code === "signup_disabled") {
    return "Registration is currently unavailable. Please try again later.";
  }
  return "Unable to complete registration. Check your connection and try again later.";
}
