import { AppError } from "./index";
import type { AuthErrorCode } from "./types/auth";
import type { InvariantErrorCode } from "./types/invarient";
import type { ValidationErrorCode } from "./types/validation";

/**
 * Structured guidance describing how the UI should surface an `AppError`.
 *
 * @property {boolean} escalate When true, the error boundary should open instead of showing lightweight UX.
 * @property {string} userMessage Primary text copy for toasts or inline messaging when not escalating.
 * @property {string} [title] Optional headline to display above the message in toast/modal surfaces.
 * @property {'info' | 'warning' | 'error'} [intent] Visual intent hint helping the notifier choose styling.
 */
export type UxDecision = {
  escalate: boolean;
  userMessage: string;
  title?: string;
  intent?: "info" | "warning" | "error";
};

export function decideUx(e: AppError): UxDecision {
  if (e.severity === "fatal") {
    return { escalate: true, userMessage: "The app needs to restart" };
  }

  switch (e.kind) {
    case "validation": {
      const code = (
        typeof e.code === "string" ? e.code : "VALIDATION_ERROR"
      ) as ValidationErrorCode;
      switch (code) {
        case "VALIDATION_REQUIRED":
          return {
            escalate: false,
            title: "Missing information",
            intent: "warning",
            userMessage: e.message ?? "Please fill in the required fields.",
          };
        case "VALIDATION_PATTERN_MISMATCH":
          return {
            escalate: false,
            title: "Check the format",
            intent: "warning",
            userMessage:
              e.message ?? "One or more values are not in the expected format.", //Can be changed. Likely for email or phone
          };
        case "VALIDATION_OUT_OF_RANGE":
          return {
            escalate: false,
            title: "Value out of range",
            intent: "warning",
            userMessage:
              e.message ??
              "Adjust the value so it stays within the allowed range.", //Can be changed.
          };
        case "VALIDATION_UNIQUE":
          return {
            escalate: false,
            title: "Already in use",
            intent: "warning",
            userMessage:
              e.message ??
              "That value is already taken. Please try a different one.", //Can be changed. Likely for usernames or emails
          };
        case "VALIDATION_CONFLICT":
          return {
            escalate: false,
            title: "Conflicting data",
            intent: "warning",
            userMessage:
              e.message ??
              "Please update the conflicting fields and try again.",
          };
        default:
          return {
            escalate: false,
            intent: "warning",
            userMessage:
              e.message ?? "Please double-check the highlighted fields.",
          };
      }
    }

    case "auth": {
      const code = (
        typeof e.code === "string" ? e.code : "AUTH_ERROR"
      ) as AuthErrorCode;
      switch (code) {
        case "AUTH_EMAIL_UNVERIFIED":
          return {
            escalate: false,
            title: "Verify your email",
            intent: "warning",
            userMessage:
              "Check your inbox for the verification link to finish signing in.",
          };
        case "AUTH_SESSION_EXPIRED":
          return {
            escalate: false,
            title: "Session expired",
            intent: "warning",
            userMessage: "Please sign in again to continue.",
          };
        case "AUTH_LOGIN_REQUIRED":
          return {
            escalate: false,
            title: "Authentication required",
            intent: "warning",
            userMessage: "Please sign in to access this feature.",
          };
        case "AUTH_CREDENTIAL_REJECTED":
          return {
            escalate: false,
            title: "Incorrect credentials",
            intent: "error",
            userMessage:
              "Email or password didn’t match. Try again or reset your password.",
          };
        case "AUTH_PROVIDER_MISMATCH":
          return {
            escalate: false,
            title: "Choose the correct sign-in",
            intent: "warning",
            userMessage:
              "Please use the same provider you originally used to create your account.",
          };
        case "AUTH_REQUEST_NOT_READY":
          return {
            escalate: false,
            title: "Login not ready",
            intent: "info",
            userMessage:
              "Sorry! We weren’t ready. Please try again in a moment.",
          };
        case "AUTH_CANCELLED":
          return {
            escalate: false,
            title: "Sign-in cancelled",
            intent: "info",
            userMessage:
              "You cancelled the sign-in. Please start again when you’re ready.",
          };
        case "AUTH_REQUEST_FAILED":
          return {
            escalate: false,
            title: "Sign-in failed",
            intent: "error",
            userMessage:
              e.message ??
              "We couldn’t complete the sign-in. Please try again.",
          };
        default:
          return {
            escalate: false,
            title: "Session expired",
            intent: "warning",
            userMessage: e.message ?? "Session expired. Please sign in.",
          };
      }
    }

    case "network": {
      const status = e.status ?? 0;
      const retryable = e.retryable ?? false;
      const attempt = e.attempt ?? 1;

      if (retryable) {
        return {
          escalate: false,
          title: "Connection hiccup",
          intent: "warning",
          userMessage:
            attempt > 1
              ? "Still retrying the request. We’ll keep trying for a moment."
              : "Network looks unstable. We’ll retry automatically.",
        };
      }

      if (status === 401) {
        return {
          escalate: false,
          title: "Authentication required",
          intent: "error",
          userMessage: "Please sign in to continue.",
        };
      }

      if (status === 403) {
        return {
          escalate: false,
          title: "Access denied",
          intent: "error",
          userMessage: "You do not have permission to perform this action.",
        };
      }

      if (status === 404) {
        return {
          escalate: false,
          title: "Not found",
          intent: "warning",
          userMessage: "We could not locate that resource.",
        };
      }

      if (status === 429) {
        return {
          escalate: false,
          title: "Too many requests",
          intent: "warning",
          userMessage:
            "You are sending requests too quickly. Please wait a moment and try again.",
        };
      }

      if (status >= 500) {
        return {
          escalate: false,
          title: "Server unavailable",
          intent: "error",
          userMessage:
            "The server is having trouble. Please try again shortly.",
        };
      }

      if (status === 0) {
        return {
          escalate: false,
          title: "No connection",
          intent: "warning",
          userMessage:
            "Check your connection and try again once you are back online.",
        };
      }

      console.log("Unhandled network error:", e);
      return {
        escalate: false,
        title: "Request failed",
        intent: "warning",
        userMessage:
          e.message || "We couldn’t complete the request. Please try again.",
      };
    }

    case "invariant": {
      const code = (
        typeof e.code === "string" ? e.code : "INVARIANT_ERROR"
      ) as InvariantErrorCode;
      switch (code) {
        case "INVARIANT_CONFIG_MISSING":
          return {
            escalate: true,
            title: "Configuration error",
            userMessage:
              "Critical configuration is missing. Restart the app and try again.",
          };
        case "INVARIANT_STATE_CORRUPTED":
          return {
            escalate: true,
            title: "State corrupted",
            userMessage:
              "The app hit an unexpected state. Restart is required.",
          };
        case "INVARIANT_UNREACHABLE":
          return {
            escalate: true,
            title: "Unexpected path",
            userMessage:
              "Woops, we reached an unexpected path. Restart the app.",
          };
        case "INVARIANT_UNSUPPORTED":
          return {
            escalate: true,
            title: "Unsupported action",
            userMessage: e.message ?? "This feature is not supported.",
          };
        default:
          return {
            escalate: true,
            title: "Fatal error",
            userMessage:
              e.message ??
              "The app encountered a critical error and must restart.",
          };
      }
    }

    default:
      return {
        escalate: false,
        userMessage: "Unexpected error. Please try again.",
      };
  }
}
