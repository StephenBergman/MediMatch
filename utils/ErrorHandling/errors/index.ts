export type ErrorKind =
  | "network"
  | "auth"
  | "validation"
  | "invariant"
  | "unknown";
export type Severity = "info" | "warning" | "error" | "fatal";

export type AppErrorOptions = {
  code?: string | number;
  status?: number;
  severity?: Severity;
  method?: string;
  url?: string;
  retryable?: boolean;
  attempt?: number;
  requestId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Rich application error with typed classification and severity.
 *
 * @param message Human-readable description of the failure.
 * @param kind Logical error grouping used by policy/UX handlers.
 * @param opts Optional metadata (code, HTTP status, severity override).
 */
export class AppError extends Error {
  kind: ErrorKind;
  code?: string | number;
  status?: number;
  severity: Severity;
  method?: string;
  url?: string;
  retryable?: boolean;
  attempt?: number;
  requestId?: string;
  metadata?: Record<string, unknown>;

  constructor(
    message: string,
    kind: ErrorKind = "unknown",
    opts: AppErrorOptions = {}
  ) {
    super(message);
    this.name = "AppError";
    this.kind = kind;
    this.code = opts.code;
    this.status = opts.status;
    this.severity = opts.severity ?? (kind === "invariant" ? "fatal" : "error");
    this.method = opts.method;
    this.url = opts.url;
    this.retryable = opts.retryable;
    this.attempt = opts.attempt;
    this.requestId = opts.requestId;
    this.metadata = opts.metadata;
  }
}
