import type { LoggingService as LoggingServiceContract } from "@/utils/ErrorHandling/helpers/types";
import { ConsoleLoggingService } from "./ConsoleLoggingService";
import { SentryLoggingService } from "./SentryLoggingService";

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();

export function createLoggingClient(): LoggingServiceContract {
  if (sentryDsn) {
    return new SentryLoggingService();
  }
  return ConsoleLoggingService;
}

const LoggingService = createLoggingClient();

export type {
  LoggingPayload,
  LoggingService as LoggingServiceContract,
} from "utils/ErrorHandling/helpers/types";
export { LoggingService as LoggingService };
