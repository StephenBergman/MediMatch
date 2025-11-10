import type {
  LoggingPayload,
  LoggingService,
} from "utils/ErrorHandling/helpers/types";

const levelToConsole: Record<string, "debug" | "info" | "warn" | "error"> = {
  debug: "debug",
  info: "info",
  warning: "warn",
  error: "error",
  fatal: "error",
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
    const method = levelToConsole[payload.level ?? "info"] ?? "log";
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

    if (
      payload.error
      //   ((typeof __DEV__ !== 'undefined' && __DEV__) || process.env.NODE_ENV === 'development')
    )
      console.log("[raw error]", payload.error.raw);
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
