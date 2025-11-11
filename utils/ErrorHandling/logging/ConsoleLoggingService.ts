import type {
  LoggingPayload,
  LoggingService,
} from "utils/ErrorHandling/helpers/types";

const levelToConsole: Record<string, "debug" | "info"> = {
  debug: "debug",
  info: "info",
  warning: "info",
  error: "info",
  fatal: "info",
};

const summarize = (payload: LoggingPayload) => {
  const { level = "info", message, tags } = payload;
  const origin = (tags?.origin ?? tags?.where) as string | undefined;

  const parts = [
    `[Logging:${level.toUpperCase()}]`,
    origin ? `origin=${origin}` : null,
    tags?.code ? `code=${tags.code}` : null,
    `message="${message}"`,
  ]
    .filter(Boolean)
    .join(" | ");

  return parts;
};

export const ConsoleLoggingService: LoggingService = {
  async submit(payload: LoggingPayload) {
    const method =
      process.env.NODE_ENV === "development"
        ? levelToConsole[payload.level ?? "info"] ?? "info"
        : "debug";
    console[method](summarize(payload));

    const componentStack = payload.context?.componentStack as
      | string
      | undefined;
    const guardFrames = payload.context?.guardFrames as string[] | undefined;

    if (componentStack) {
      console.debug("[component stack]", componentStack);
    } else if (guardFrames?.length) {
      console.debug("[guard trace]", guardFrames.join("\n"));
    }

    // Intentionally skip dumping raw errors to avoid RN call stacks for every warning.
  },

  async capture(error, payload) {
    const err =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            raw: error,
          }
        : { message: String(error), raw: error };

    await this.submit({
      message: err.message ?? "Captured error",
      level: "error",
      error: err,
      ...payload,
    });
  },
};
