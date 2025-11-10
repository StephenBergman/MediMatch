import { AppError, type AppErrorOptions, type Severity } from "../index";

export type InvariantErrorCode =
  | "INVARIANT_ERROR"
  | "INVARIANT_STATE_CORRUPTED"
  | "INVARIANT_UNREACHABLE"
  | "INVARIANT_CONFIG_MISSING"
  | "INVARIANT_UNSUPPORTED"
  | (string & {});

export type InvariantErrorOptions = Omit<
  AppErrorOptions,
  "code" | "severity"
> & {
  code?: InvariantErrorCode;
  severity?: Severity;
};

export const invariantError = (
  msg: string,
  options: InvariantErrorOptions = {}
) =>
  new AppError(msg, "invariant", {
    ...options,
    code: options.code ?? "INVARIANT_ERROR",
    severity: options.severity ?? "fatal",
  });
