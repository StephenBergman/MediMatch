// This file centralizes error capture utilities. wraps call sites, extracts origins, forwards telemetry, and bridges global failures into the app’s error boundary.

import { normalizeUnknown } from "utils/ErrorHandling/errors/normalize";
import type { UxDecision } from "utils/ErrorHandling/errors/policy";
import { decideUx } from "utils/ErrorHandling/errors/policy";
import { LoggingService } from "utils/ErrorHandling/logging";
import { AppError } from "../errors";

const APP_ERROR_ORIGIN = Symbol("appErrorOrigin");

const getStoredOrigin = (err: unknown): string | undefined =>
  err instanceof AppError
    ? (err as { [APP_ERROR_ORIGIN]?: string })[APP_ERROR_ORIGIN]
    : undefined;

const setStoredOrigin = (err: unknown, origin?: string) => {
  if (origin && err instanceof AppError) {
    (err as { [APP_ERROR_ORIGIN]?: string })[APP_ERROR_ORIGIN] = origin;
  }
};

interface CallerInfo {
  name?: string;
  file?: string;
  line?: number;
  column?: number;
  fullPath?: string;
}

const INTERNAL_FRAME_PATTERNS: RegExp[] = [
  /\bguardAsync\b/i,
  /\bguard\b/i,
  /\bcaptureException\b/i,
  /\bLoggingService\b/i,
  /\bgetCallerInfo\b/i,
  /node_modules/i,
  /expo-router/i,
];

const isInternalFrame = (frame?: string) => {
  if (!frame) return true;
  if (INTERNAL_FRAME_PATTERNS.some((pattern) => pattern.test(frame))) {
    return true;
  }
  const match = frame.match(/\(([^)]+)\)/);
  if (!match?.[1]) return false;
  const { fullPath } = parseStackLocation(match[1]);
  return isInternalPath(fullPath);
};

const parseStackLocation = (location?: string) => {
  if (!location) return {};
  const match = location.match(/^(.*):(\d+):(\d+)$/);
  if (!match) return { fullPath: location };

  const [, rawPath, line, column] = match;
  return {
    fullPath: rawPath,
    line: Number(line),
    column: Number(column),
  };
};

/**
 * Normalizes a raw stack-frame location by decoding it and trimming query/hash fragments.
 */
const extractSourcePath = (raw?: string) => {
  if (!raw) return undefined;

  const safeDecode = (value?: string | null) => {
    if (!value) return undefined;
    try {
      return decodeURIComponent(value);
    } catch {
      return value ?? undefined;
    }
  };

  const stripQueryAndHash = (value: string) => {
    const [withoutQuery] = value.split("?");
    const [withoutHash] = withoutQuery.split("#");
    return withoutHash;
  };

  const parseSearch = (search: string) => {
    if (!search) return undefined;
    const params = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search
    );
    return (
      safeDecode(params.get("transform.routerRoot")) ??
      safeDecode(params.get("routerRoot")) ??
      safeDecode(params.get("bundleEntry"))
    );
  };

  try {
    const url = new URL(raw);
    return (
      parseSearch(url.search) ??
      safeDecode(stripQueryAndHash(url.pathname || ""))
    );
  } catch {
    /* ignore */
  }

  const [path, search = ""] = raw.split("?");
  return parseSearch(search) ?? safeDecode(stripQueryAndHash(path));
};

const formatOriginFromLocation = (fullPath?: string, line?: number) => {
  if (!fullPath) return undefined;

  const queryStripped = fullPath.split("?")[0].split("#")[0];
  const normalized = queryStripped.replace(/\\/g, "/");

  const parts = normalized
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });

  if (!parts.length) return undefined;

  const trimmed = parts.slice(-2).join("/");
  const withoutExt = trimmed.replace(/\.[^.]+$/, "");
  return line ? `${withoutExt}:${line}` : withoutExt;
};

const isInternalPath = (path?: string) =>
  !!path && /utils[\\/]+ErrorHandling[\\/]+(helpers|logging)[\\/]+/i.test(path);

/**
 * Registers a callback that receives fatal errors promoted to the boundary.
 *
 * @param fn Handler invoked when promoteToBoundary is called.
 */
let fatalPromoter: ((e: Error) => void) | null = null;
export const registerFatalPromoter = (fn: (e: Error) => void) => {
  fatalPromoter = fn;
};

/**
 * Registers a callback that receives error origin for errors promoted to the boundary.
 *
 * @param fn Handler invoked when origin is determined for an error.
 */
let originLogger: ((str: string) => void) | null = null;
export const registerOriginLogger = (fn: (str: string) => void) => {
  originLogger = fn;
};

let uxNotifier: ((ux: UxDecision, err: AppError) => void) | null = null;

/**
 * Registers a UI-side notifier invoked whenever guardAsync decides not to escalate.
 *
 * Apps should call this once at startup (e.g., from ErrorNotificationsHost) so
 * background errors automatically surface a toast/banner without repeating logic.
 *
 * Pass `null` to clear the notifier on unmount.
 */
export function registerUxNotifier(fn: typeof uxNotifier) {
  uxNotifier = fn;
}

export function notifyUx(ux: UxDecision, err: AppError) {
  uxNotifier?.(ux, err);
}

/**
 * Forces an error through the registered fatal handler/boundary.
 *
 * Wraps non-Error values in Error for consistency.
 *
 * @param e Error or unknown value to escalate.
 */
export const promoteToBoundary = (e: unknown) =>
  fatalPromoter?.(e instanceof Error ? e : new Error(String(e)));

/**
 * Produces a trimmed stack, skipping internal frames and noise.
 */
const formatGuardFrames = (stack?: string) =>
  stack
    ?.split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line.startsWith("at ") && !isInternalFrame(line))
    .slice(0, 10);

const extractGuardLabel = (stack?: string) => {
  if (!stack) return undefined;
  const firstLine = stack.split("\n")[0]?.trim();
  const match = firstLine?.match(/guardAsync:(.+)$/);
  return match?.[1]?.trim();
};

const extractGuardOrigin = (frame?: string) => {
  if (!frame) return undefined;
  const match = frame.match(
    /^at\s+(?:async\s+)?([^( \s]+)?\s*(?:\(([^)]+)\))?/
  );
  if (!match) return undefined;

  const [, rawFnName, location] = match;
  const cleaned = cleanOriginString(rawFnName?.replace(/\[.*\]$/, "").trim());
  if (cleaned) return cleaned;

  const { fullPath, line } = parseStackLocation(location);
  return formatOriginFromLocation(fullPath, line);
};

const prettifyStackFrame = (frame: string) => {
  const match = frame.match(/\((.+)\)/);
  const { fullPath, line } = parseStackLocation(match?.[1]);
  const sourcePath = extractSourcePath(fullPath);
  const label = extractGuardOrigin(frame);
  const location = formatOriginFromLocation(sourcePath, line);
  return [label, location].filter(Boolean).join(" ").trim();
};

/**
 * Attempts to identify the function that threw by inspecting an error stack.
 */
const extractThrownBy = (stack?: string) => {
  if (!stack) return undefined;
  const frame = stack
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && line.startsWith("at ") && !isInternalFrame(line));
  return extractGuardOrigin(frame);
};

const getFunctionName = (fn: Function): string => {
  if (fn.name && fn.name !== "anonymous") {
    return fn.name
      .replace("bound ", "")
      .replace("mount", "")
      .replace("Memo", "");
  }

  const fnString = fn.toString();

  const nameMatches = fnString.match(
    /(?:async\s+)?(?:function\s+)?(\w+)\s*(?:=|\()/
  );
  if (nameMatches?.[1]) {
    return nameMatches[1];
  }

  if (fnString.includes("React.Component") || fnString.includes("useState")) {
    const componentMatch = fnString.match(/function\s+(\w+)/);
    return componentMatch?.[1] || "Component";
  }

  const parentMatch = fnString.match(/return\s+(\w+)\(/);
  if (parentMatch?.[1]) {
    return parentMatch[1];
  }

  return "anonymous";
};

const getCallerInfo = (): CallerInfo => {
  const stack = new Error().stack;
  if (!stack) return {};

  const frames = stack
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("at "));

  const callerFrame =
    frames.find((frame) => !isInternalFrame(frame)) ?? frames[0];
  if (!callerFrame) return {};

  const match = callerFrame.match(
    /^at\s+(?:async\s+)?([^( \s]+)?\s*(?:\(([^)]+)\))?/
  );
  if (!match) return {};

  const [, rawFnName, location] = match;
  const { fullPath, line, column } = parseStackLocation(location);
  const file = fullPath
    ?.replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "");

  return {
    name: rawFnName?.trim(),
    file,
    fullPath,
    line,
    column,
  };
};

/**
 * Any global error whose message/stack includes one of these substrings will be ignored.
 * Copy the exact string you see in the console, paste it here, and the handler will silence it.
 */
const IGNORED_GLOBAL_ERROR_STRINGS: string[] = [];

/**
 * Toggle for suppressing noisy global errors without deleting the strings above.
 * Defaults to true; set EXPO_PUBLIC_SUPPRESS_GLOBAL_ERRORS=false to disable at runtime.
 */
const GLOBAL_ERROR_SUPPRESSION_ENABLED =
  (process.env.EXPO_PUBLIC_SUPPRESS_GLOBAL_ERRORS ?? "false").toLowerCase() !==
  "false";

/**
 * Derives a human-readable message from an unknown error payload.
 *
 * @param error - Raw error or event payload coming from RN ErrorUtils or window handlers.
 * @returns Best-effort string representation (empty string when nothing usable is found).
 */
const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error && typeof (error as { message?: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  if (
    error &&
    typeof (error as { toString?: () => string }).toString === "function"
  ) {
    try {
      return (error as { toString: () => string }).toString();
    } catch {
      /* ignore */
    }
  }
  return "";
};

/**
 * Determines whether a global error should be filtered out before hitting captureException.
 *
 * @param error - Raw error instance or event payload.
 * @returns True when the error message/stack contains one of the ignored substrings.
 */
const shouldIgnoreGlobalError = (error: unknown) => {
  if (!GLOBAL_ERROR_SUPPRESSION_ENABLED) {
    return false;
  }

  const normalize = (value: string) => value.trim().toLowerCase();

  const message = normalize(getErrorMessage(error));
  const stack =
    error && typeof (error as { stack?: unknown }).stack === "string"
      ? normalize((error as { stack: string }).stack)
      : "";

  const haystacks = [message, stack].filter((value) => value.length > 0);

  return haystacks.some((value) =>
    IGNORED_GLOBAL_ERROR_STRINGS.some((pattern) =>
      value.includes(normalize(pattern))
    )
  );
};

/**
 * Emits a visible breadcrumb when we drop a global error during development.
 *
 * @param error - The ignored error payload (useful for double-checking suppressions).
 */
const logIgnoredGlobalError = (error: unknown) => {
  const isDev =
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    process.env.NODE_ENV === "development";
  if (isDev) {
    console.warn("[Manual Dev toggle] Ignored global error", error);
  }
};

const IGNORED_NAMES = [
  "construct",
  "constructor",
  "function",
  "object",
  "anonymous",
  "component",
  "render",
  "module",
  "native",
  "unknown",
  "svg",
];

const cleanOriginString = (str?: string) => {
  if (!str) return undefined;
  const trimmed = str.trim();
  const lower = trimmed.toLowerCase();
  if (!trimmed || IGNORED_NAMES.includes(lower)) {
    return undefined;
  }
  if (
    lower.includes("platform=") ||
    lower.includes("transform") ||
    lower.includes("hermes") ||
    lower.includes("react.")
  ) {
    return undefined;
  }
  return trimmed;
};

/**
 * Normalizes, logs, and forwards an exception to the Logging pipeline.
 *
 * @param err Any thrown value to capture.
 * @param extra Additional tags/metadata forwarded to telemetry.
 * @param options.escalate When true, rethrows through the fatal boundary hook.
 * @returns The normalized AppError for further handling.
 */
export function captureException(
  err: unknown,
  extra: Record<string, unknown> = {},
  { escalate }: { escalate?: boolean } = {}
) {
  const errorWithStack = err instanceof Error ? err : new Error(String(err));
  const errorStack = (err as Error)?.stack?.split("\n");
  const errorLocationMatch = errorStack?.[1]?.match(/\((.+)\)/);
  const { fullPath: errorPath, line: errorLine } = parseStackLocation(
    errorLocationMatch?.[1]
  );
  const sanitizeOrigin = (value?: string) => cleanOriginString(value);
  const guardStack = (extra as any)?.guardStack as string | undefined;
  const guardFrames = formatGuardFrames(guardStack);
  const formattedGuardFrames =
    guardFrames?.map(prettifyStackFrame).filter(Boolean) ?? [];
  const guardLabel = sanitizeOrigin(extractGuardLabel(guardStack));
  const componentStack =
    typeof (err as any)?.componentStack === "string"
      ? (err as any).componentStack.trim()
      : typeof (extra as any)?.componentStack === "string"
        ? (extra as any).componentStack.trim()
        : undefined;
  const explicitWhere = sanitizeOrigin(
    typeof (extra as any)?.where === "string" ? (extra as any).where : undefined
  );
  const thrownBy = sanitizeOrigin(
    typeof (extra as any)?.thrownBy === "string"
      ? (extra as any).thrownBy
      : undefined
  );
  const wrapCallSite =
    typeof (extra as any)?.callSite === "string"
      ? (extra as any).callSite
      : undefined;

  const appErr =
    err instanceof AppError ? err : normalizeUnknown(errorWithStack);
  const { context: extraContextFromCaller, ...extraTags } = extra as {
    context?: Record<string, unknown>;
    [key: string]: unknown;
  };

  const networkTagValues =
    appErr.kind === "network"
      ? {
          ...(appErr.method ? { "http.method": appErr.method } : {}),
          ...(appErr.url ? { "http.url": appErr.url } : {}),
          ...(appErr.retryable !== undefined
            ? { "network.retryable": String(appErr.retryable) }
            : {}),
          ...(appErr.attempt !== undefined
            ? { "network.attempt": String(appErr.attempt) }
            : {}),
          ...(appErr.requestId
            ? { "network.requestId": appErr.requestId }
            : {}),
        }
      : {};

  const networkContextDetails =
    appErr.kind === "network"
      ? {
          ...(appErr.method ? { method: appErr.method } : {}),
          ...(appErr.url ? { url: appErr.url } : {}),
          ...(appErr.retryable !== undefined
            ? { retryable: appErr.retryable }
            : {}),
          ...(appErr.attempt !== undefined ? { attempt: appErr.attempt } : {}),
          ...(appErr.requestId ? { requestId: appErr.requestId } : {}),
          ...(appErr.metadata ? { metadata: appErr.metadata } : {}),
        }
      : {};

  const networkContext =
    appErr.kind === "network" && Object.keys(networkContextDetails).length
      ? { network: networkContextDetails }
      : {};

  const sourcePathPattern = /(?:^|[\/\\])(src|app)(?:[\/\\]|$)/;

  const guardOrigin = guardFrames
    ?.slice()
    .reverse()
    .map((frame) => {
      const match = frame.match(/\((.+)\)/);
      const { fullPath } = parseStackLocation(match?.[1]);
      const sourcePath = extractSourcePath(fullPath);
      return {
        label: sanitizeOrigin(extractGuardOrigin(frame)),
        path: sourcePath,
      };
    })
    .find(({ path, label }) => {
      const cleanPath = path ?? "";
      return (
        !isInternalPath(cleanPath) && sourcePathPattern.test(cleanPath) && label
      );
    });

  const errorFrame = errorStack
    ?.map((line) => line.trim())
    .filter(Boolean)
    .reverse()
    .map((line) => {
      const match = line.match(/\((.+)\)/);
      const { fullPath, line: frameLine } = parseStackLocation(match?.[1]);
      const sourcePath = extractSourcePath(fullPath);
      return { fullPath: sourcePath, line: frameLine };
    })
    .find(
      ({ fullPath }) =>
        fullPath &&
        !isInternalPath(fullPath) &&
        sourcePathPattern.test(fullPath)
    );

  const storedOrigin = getStoredOrigin(err);

  const originLabel =
    storedOrigin ??
    (wrapCallSite && sanitizeOrigin(wrapCallSite)) ??
    explicitWhere ??
    thrownBy ??
    (guardLabel && guardLabel !== "native" && guardLabel !== "anonymous"
      ? guardLabel
      : undefined) ??
    (guardOrigin?.path
      ? formatOriginFromLocation(guardOrigin.path, undefined)
      : (formatOriginFromLocation(errorFrame?.fullPath, errorFrame?.line) ??
        formatOriginFromLocation(errorPath, errorLine)));

  setStoredOrigin(appErr, originLabel);

  const payload: Parameters<typeof LoggingService.submit>[0] = {
    message: appErr.message,
    level: appErr.severity === "fatal" ? "fatal" : appErr.severity,
    tags: {
      kind: appErr.kind,
      code: String(appErr.code ?? ""),
      status: String(appErr.status ?? ""),
      ...(originLabel ? { origin: originLabel } : {}),
      ...extraTags,
      ...networkTagValues,
    },
    context: {
      ...(extraContextFromCaller as Record<string, unknown> | undefined),
      guardFrames,
      componentStack,
      ...(originLabel ? { origin: originLabel } : {}),
      isFatal: appErr.severity === "fatal",
      ...networkContext,
    },
    error: {
      name: appErr.name,
      message: appErr.message,
      stack: guardStack ?? appErr.stack,
      raw: process.env.NODE_ENV === "development" ? err : undefined,
    },
  };

  const isDev =
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    process.env.NODE_ENV === "development";

  if (isDev) {
    originLogger?.(originLabel);
    const summary = [
      `[captureException] ${appErr.kind}`,
      appErr.code ? `code=${appErr.code}` : null,
      (originLabel ?? explicitWhere)
        ? `origin=${originLabel ?? explicitWhere}`
        : null,
      appErr.status ? `status=${appErr.status}` : null,
      guardLabel ? `guard=${guardLabel}` : null,
      guardFrames?.length ? `frames=${guardFrames.length}` : null,
    ]
      .filter(Boolean)
      .join(" ");
    console.error(summary);
    if (formattedGuardFrames?.length) {
      // console.log(
      //   `[captureException] guard stack\n${formattedGuardFrames.join("\n")}`
      // );
    }
  }

  LoggingService.submit(payload);

  if (escalate) promoteToBoundary(appErr);

  return appErr;
}

type GuardOptionsBase = {
  where?: string;
  onUxDecision?: (ux: UxDecision, appErr: AppError) => void;
};

type MaybeThunk<T> = T | ((error: AppError) => T | Promise<T>);

export type GuardOptions<T extends (...args: any[]) => any> = GuardOptionsBase &
  (ReturnType<T> extends Promise<any>
    ? { asyncFallback?: MaybeThunk<Awaited<ReturnType<T>> | null> }
    : // eslint-disable-next-line
      {});

type GuardedReturn<T extends (...args: any[]) => any> =
  ReturnType<T> extends Promise<any>
    ? Promise<Awaited<ReturnType<T>> | null>
    : ReturnType<T> | undefined;

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  !!value &&
  (typeof value === "object" || typeof value === "function") &&
  typeof (value as PromiseLike<unknown>).then === "function";

const resolveAsyncFallback = async <T>(
  fallback: MaybeThunk<T | null> | undefined,
  error: AppError
): Promise<T | null> => {
  if (!fallback) return null;
  const resolved =
    typeof fallback === "function"
      ? (fallback as (err: AppError) => T | null | Promise<T | null>)(error)
      : fallback;
  return await resolved;
};

/**
 * Wraps a function so failures flow through captureException and UX policy.
 *
 * Sync handlers:
 *   - Exceptions are logged.
 *   - If policy escalates, the original AppError is rethrown.
 *   - Otherwise the wrapper returns undefined.
 *
 * Async handlers:
 *   - Rejected promises are logged.
 *   - Escalated rejections rethrow the AppError.
 *   - Non-escalated rejections resolve to `asyncFallback` (default null).
 *
 * @template T Callable to protect.
 * @param fn Function to guard.
 * @param options.where Override for the auto-detected origin label.
 * @param options.onUxDecision Hook invoked after policy runs (defaults to the global notifier).
 * @param options.asyncFallback Value or thunk returned when a non-escalated async rejection occurs.
 * @returns A callable mirroring `fn` with logging + policy semantics.
 */
export function guard<T extends (...args: any[]) => any>(
  fn: T,
  options: GuardOptions<T> = {} as GuardOptions<T>
) {
  const { where, onUxDecision } = options;

  const rawFnName = getFunctionName(fn);
  const caller = getCallerInfo();

  const callerName = cleanOriginString(caller.name);
  const fnLabel = cleanOriginString(rawFnName);
  const callerPath = extractSourcePath(caller.fullPath);
  const callerFilePath = !isInternalPath(callerPath)
    ? callerPath
    : caller.fullPath;
  const locationOrigin = formatOriginFromLocation(callerFilePath, caller.line);
  const locationLabel = cleanOriginString(locationOrigin);
  const callSite =
    caller.fullPath && caller.line
      ? `${caller.fullPath}:${caller.line}`
      : caller.fullPath;

  const autoOrigin =
    where ??
    (() => {
      if (callerName && fnLabel) {
        return `${callerName}.${fnLabel}`;
      }
      const fallback = [callerName, fnLabel, locationLabel].find(
        (name): name is string =>
          !!name && !IGNORED_NAMES.includes(name.toLowerCase())
      );
      return fallback ?? "unknown";
    })();

  const asyncFallback = (
    options as GuardOptionsBase & {
      asyncFallback?: MaybeThunk<Awaited<ReturnType<T>> | null>;
    }
  ).asyncFallback;

  return (...args: Parameters<T>): GuardedReturn<T> => {
    const isDev = process.env.NODE_ENV === "development";
    const guardStack = isDev
      ? new Error(`guardAsync:${autoOrigin || "anonymous"}`).stack
      : undefined;

    const buildExtra = () => {
      const extra: Record<string, unknown> = {};
      extra.where = autoOrigin;
      if (callSite) extra.callSite = callSite;
      if (guardStack) extra.guardStack = guardStack;
      if (locationOrigin) extra.location = locationOrigin;
      if (fnLabel) extra.functionName = fnLabel;
      if (callerName) extra.caller = callerName;
      return extra;
    };

    const handleFailure = (
      err: unknown
    ): { appErr: AppError; ux: UxDecision } => {
      const extra = buildExtra();
      const thrownBy = extractThrownBy(
        err instanceof Error ? err.stack : undefined
      );
      if (thrownBy) extra.thrownBy = thrownBy;

      const appErr = captureException(err, extra);
      if (guardStack && appErr.severity !== "fatal") {
        const formatted =
          formatGuardFrames(guardStack)
            ?.map(prettifyStackFrame)
            .filter(Boolean) ?? [];
        if (formatted.length) {
          // console.debug(`[guardAsync] trace (${autoOrigin ?? 'anonymous'})\n${formatted.join('\n')}`);
        }
      }
      const ux = decideUx(appErr);
      onUxDecision?.(ux, appErr);
      const notify = onUxDecision ?? uxNotifier;
      notify?.(ux, appErr);
      if (ux.escalate) promoteToBoundary(appErr);
      return { appErr, ux };
    };

    try {
      const result = fn(...args);
      if (isPromiseLike(result)) {
        const promiseResult = result as Promise<Awaited<ReturnType<T>>>;
        return promiseResult.catch(async (err) => {
          const { appErr, ux } = handleFailure(err);
          if (ux.escalate) throw appErr;
          return resolveAsyncFallback(asyncFallback, appErr);
        }) as GuardedReturn<T>;
      }
      return result as GuardedReturn<T>;
    } catch (err) {
      const { appErr, ux } = handleFailure(err);
      if (ux.escalate) throw appErr;
      return undefined as GuardedReturn<T>;
    }
  };
}

export const guardAsync = guard;

/**
 * Installs global listeners (React Native ErrorUtils, window events) to capture unhandled errors.
 *
 * @param options.escalateUnhandled Escalate unhandled errors to the fatal boundary when true.
 */
export function installGlobalErrorHandlers({ escalateUnhandled = true } = {}) {
  const g: any = global as any;
  const prev = g?.ErrorUtils?.getGlobalHandler?.();

  // Wrap RN’s global handler so we can short‑circuit known noisy errors before they hit captureException and the fatal boundary.
  g?.ErrorUtils?.setGlobalHandler?.((error: any, isFatal?: boolean) => {
    if (shouldIgnoreGlobalError(error)) {
      logIgnoredGlobalError(error);
      return;
    }
    const appErr = captureException(
      error,
      { layer: "ErrorUtils", where: "global.ErrorUtils", isFatal },
      { escalate: escalateUnhandled }
    );
    prev?.(appErr, isFatal);
  });

  const target: any =
    typeof window !== "undefined" &&
    typeof window.addEventListener === "function"
      ? window
      : typeof globalThis !== "undefined" &&
          typeof (globalThis as any).addEventListener === "function"
        ? globalThis
        : null;

  if (target) {
    // Both listeners exit early when an ignored message is detected, keeping the fatal UI quiet while
    // still logging a breadcrumb in development builds.
    const onError = (ev: any) => {
      const payload = ev?.error ?? ev?.message ?? ev;
      if (shouldIgnoreGlobalError(payload)) {
        logIgnoredGlobalError(payload);
        return;
      }
      captureException(
        payload,
        { layer: "window.error", where: "global.window.error" },
        { escalate: escalateUnhandled }
      );
    };

    const onUnhandledRejection = (ev: any) => {
      const payload = ev?.reason ?? ev;
      if (shouldIgnoreGlobalError(payload)) {
        logIgnoredGlobalError(payload);
        return;
      }
      captureException(
        payload,
        { layer: "unhandledrejection", where: "global.unhandledRejection" },
        { escalate: escalateUnhandled }
      );
    };

    target.addEventListener("error", onError);
    target.addEventListener("unhandledrejection", onUnhandledRejection);
  }
}

/**
 * Forwards a prepared logging payload to the active logging service.
 */
export function reportLogging(
  payload: Parameters<typeof LoggingService.submit>[0]
) {
  return LoggingService.submit(payload);
}
