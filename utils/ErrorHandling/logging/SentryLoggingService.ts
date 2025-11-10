// -------------- PLEASE NOTE ------------------//

// THIS FILE IS NOT USED AT ALL RIGHT NOW. IT SHOULD BE USED IF WE IMPLEMENT SENTRY //

// --------------------------------------------//
import type {
  LoggingPayload,
  LoggingService,
} from "utils/ErrorHandling/helpers/types";

let sentryModule: typeof import("sentry-expo") | undefined;
try {
  sentryModule = require("sentry-expo");
} catch {
  // Expo SDK not installed or not available => fall back to console implementation
}

export class SentryLoggingService implements LoggingService {
  showPopup() {
    (sentryModule as any)?.showLogging?.();
  }

  async submit(payload: LoggingPayload) {
    const native = (sentryModule as any)?.Native;
    if (!native) return;

    native.withScope((scope: any) => {
      scope.setTag("channel", "user-Logging");
      scope.setContext("Logging", payload);
      scope.setUser({
        email: payload.email,
        username: payload.name,
      });
      native.captureMessage("User Logging");
    });
  }
}
