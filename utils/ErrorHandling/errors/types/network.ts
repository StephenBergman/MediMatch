import { AppError } from "../index";

/**
 * Additional metadata describing context around a network failure.
 */
type NetworkErrorContext = {
  status?: number;
  method?: string;
  url?: string;
  code?: string;
  retryable?: boolean;
  attempt?: number;
  requestId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Constructs a typed `AppError` for networking failures while preserving useful debugging context.
 *
 * @param {string} message Human-readable description of the failure.
 * @param {number | NetworkErrorContext} [statusOrContext] HTTP status code or detailed context
 * object describing the failed request.
 * @returns {AppError} Instance representing the network error.
 */
export function networkError(
  message: string,
  statusOrContext?: number | NetworkErrorContext
) {
  const context: NetworkErrorContext =
    typeof statusOrContext === "number" || statusOrContext === undefined
      ? { status: statusOrContext }
      : statusOrContext;

  const { status, method, url, code, retryable, attempt, requestId, metadata } =
    context;

  return new AppError(message, "network", {
    status,
    code: code ?? (status != null ? String(status) : "NETWORK_ERROR"),
    severity: status && status >= 500 ? "error" : "warning",
    method,
    url,
    retryable,
    attempt,
    requestId,
    ...(metadata ? { metadata } : null),
  });
}
