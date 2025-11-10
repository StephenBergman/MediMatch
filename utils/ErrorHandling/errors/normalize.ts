import { AppError } from "./index";
import { authError } from "./types/auth";
import { networkError } from "./types/network";
import { validationError } from "./types/validation";

function isFatalError(err: unknown): boolean {
  const any = err as any;
  return (
    // React Native fatal errors
    any?.isFatal === true ||
    // JavaScript engine errors
    err instanceof TypeError ||
    err instanceof ReferenceError ||
    // React rendering errors
    any?.name === "Invariant Violation" ||
    // Out of memory
    any?.name === "RangeError" ||
    // Syntax errors
    err instanceof SyntaxError
  );
}

/**
 * Converts any thrown value into a normalized AppError instance.
 *
 * Accepts raw strings, HTTP-like objects (Axios/fetch errors), validation errors,
 * or any previously normalized AppError. Falls back to an unknown AppError when
 * the shape cannot be derived.
 *
 * @param err Arbitrary thrown value.
 * @returns Consistent AppError descriptor ready for logging or UX routing.
 */
export function normalizeUnknown(err: unknown): AppError {
  if (err instanceof AppError) return err;
  const componentStack = (err as any)?.componentStack;
  const UNKNOWN_ERROR_CODE = "UNKNOWN_GUARDED_ERROR";
  const any = err as any;

  if (componentStack && typeof any === "object" && any !== null) {
    any.componentStack = componentStack;
  }
  // Fatal error detection happens here
  if (isFatalError(err)) {
    return new AppError(any?.message ?? "A fatal error occurred", "invariant", {
      severity: "fatal",
      code: any?.code ?? any?.name,
    });
  }

  // HTTP status known
  const status: number | undefined =
    any?.status ?? any?.response?.status ?? any?.cause?.status;

  if (status != null) {
    if (status === 401 || status === 403) {
      const authCode =
        status === 401 ? "AUTH_LOGIN_REQUIRED" : "AUTH_REQUEST_FAILED";
      return authError("Authentication required", {
        code: authCode,
        status,
      });
    }
    return networkError(any?.message ?? `Network error (${status})`, status);
  }

  // Validation shape
  if (any?.name === "ValidationError" || any?.isValidationError) {
    return validationError(any?.message ?? "Invalid input", {
      code: typeof any?.code === "string" ? any.code : undefined,
    });
  }

  // Fallback
  const message =
    any?.message ??
    (typeof any === "string" ? any : "An unexpected error occurred");
  const severity = any?.severity ?? "error";

  return new AppError(message, "unknown", {
    severity,
    code: any?.code ?? UNKNOWN_ERROR_CODE,
  });
}
