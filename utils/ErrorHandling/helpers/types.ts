//For Logging submission

//Types for error handling and logging
export type LogLevel = "debug" | "info" | "warning" | "error" | "fatal";

//Payload for logging events
export type LoggingPayload = {
  message: string;
  level?: LogLevel;
  timestamp?: Date | string;
  tags?: Record<string, string | number | boolean>;
  context?: {
    origin?: string;
    guardFrames?: string[];
    componentStack?: string;
    isFatal?: boolean;
    [key: string]: unknown;
  };
  error?: {
    name?: string;
    message?: string;
    stack?: string;
    raw?: unknown;
  };
};

//Interface for logging services
export interface LoggingService {
  initialize?(opts?: Record<string, unknown>): Promise<void> | void;
  submit(payload: LoggingPayload): Promise<void>;
  capture?(
    error: unknown,
    payload?: Omit<LoggingPayload, "message">
  ): Promise<void>;
  flush?(): Promise<void>;
}
