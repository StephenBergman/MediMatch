import { AppError, type AppErrorOptions, type Severity } from "../index";

export type AuthErrorCode =
  | "AUTH_ERROR"
  | "AUTH_SESSION_EXPIRED"
  | "AUTH_EMAIL_UNVERIFIED"
  | "AUTH_PROVIDER_MISMATCH"
  | "AUTH_REQUEST_NOT_READY"
  | "AUTH_CANCELLED"
  | "AUTH_CREDENTIAL_REJECTED"
  | "AUTH_REQUEST_FAILED"
  | "AUTH_LOGIN_REQUIRED"
  | (string & {});

export type AuthErrorOptions = Omit<AppErrorOptions, "code" | "severity"> & {
  code?: AuthErrorCode;
  severity?: Severity;
};

export const authError = (
  msg = "Please sign in",
  options: AuthErrorOptions = {}
) =>
  new AppError(msg, "auth", {
    ...options,
    code: options.code ?? "AUTH_ERROR",
    severity: options.severity ?? "warning",
  });
