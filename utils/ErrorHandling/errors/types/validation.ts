import { AppError, type AppErrorOptions, type Severity } from "../index";

export type ValidationErrorCode =
  | "VALIDATION_ERROR"
  | "VALIDATION_REQUIRED"
  | "VALIDATION_PATTERN_MISMATCH"
  | "VALIDATION_OUT_OF_RANGE"
  | "VALIDATION_UNIQUE"
  | "VALIDATION_CONFLICT"
  | (string & {});

export type ValidationErrorOptions = Omit<
  AppErrorOptions,
  "code" | "severity"
> & {
  code?: ValidationErrorCode;
  severity?: Severity;
};

export const validationError = (
  msg: string,
  options: ValidationErrorOptions = {}
) =>
  new AppError(msg, "validation", {
    ...options,
    code: options.code ?? "VALIDATION_ERROR",
    severity: options.severity ?? "info",
  });
