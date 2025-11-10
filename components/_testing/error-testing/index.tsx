import ScreenView from "@/components/Tools/ScreenView";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import {
  authError,
  invariantError,
  networkError,
  validationError,
} from "@/utils/ErrorHandling/errors/types";
import axios, { Method, isAxiosError } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { guard } from "utils/ErrorHandling/helpers/capture";

type ButtonAction = () => void | Promise<unknown>;

type ExampleConfig = {
  key: string;
  label: string;
  action: ButtonAction;
  actionStyle?: "primary" | "secondary" | "negative" | "positive";
};

/**
 * Developer-only playground that triggers each error factory and guard path so the
 * error-handling stack (capture, policy, UX notifications) can be exercised end-to-end.
 */
const SANDBOX_FALLBACK_BASE_URL = "https://httpstat.us";
const SANDBOX_API_BASE_URL =
  process.env.EXPO_PUBLIC_SANDBOX_API_BASE_URL ?? SANDBOX_FALLBACK_BASE_URL;
const sandboxHttp = axios.create({
  baseURL: SANDBOX_API_BASE_URL,
  timeout: 4500,
  headers: { Accept: "text/plain" },
});

type SandboxCallArgs = {
  url: string;
  method?: Method;
  body?: Record<string, unknown>;
};

const ROUTE_STATUS_MAP: Record<string, { success: number; failure?: number }> =
  {
    "/users/sandbox/test": { success: 200, failure: 500 },
    "/auth/login": { success: 200, failure: 401 },
  };

const resolveSandboxStatus = (url: string, shouldError: boolean) => {
  const entry = ROUTE_STATUS_MAP[url];
  if (shouldError) {
    return entry?.failure ?? 500;
  }
  return entry?.success ?? 200;
};

const emptyMessage = "";

const authThrow = (options?: Parameters<typeof authError>[1]) =>
  authError(undefined, options);

const validationThrow = (options?: Parameters<typeof validationError>[1]) =>
  validationError(emptyMessage, options);

const invariantThrow = (options?: Parameters<typeof invariantError>[1]) =>
  invariantError(emptyMessage, options);

const networkThrow = (context?: number | Parameters<typeof networkError>[1]) =>
  networkError(emptyMessage, context);

export default function ErrorTesting() {
  const [showBuggyComponent, setShowBuggyComponent] = useState(false);
  const toast = useToast();

  const showSandboxToast = useCallback(
    (action: "success" | "error", title: string, description: string) => {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action={action} variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        ),
      });
    },
    [toast]
  );

  const authExamples = useMemo<ExampleConfig[]>(
    () => [
      {
        key: "auth-session-expired",
        label: "Auth • Session expired",
        action: guard(() => {
          throw authThrow({ code: "AUTH_SESSION_EXPIRED", status: 401 });
        }),
      },
      {
        key: "auth-email-unverified",
        label: "Auth • Email unverified",
        action: guard(() => {
          throw authThrow({ code: "AUTH_EMAIL_UNVERIFIED", status: 401 });
        }),
      },
      {
        key: "auth-provider-mismatch",
        label: "Auth • Provider mismatch",
        action: guard(() => {
          throw authThrow({
            code: "AUTH_PROVIDER_MISMATCH",
            metadata: { expected: "google", actual: "apple" },
          });
        }),
      },
      {
        key: "auth-login-required",
        label: "Auth • Login required",
        action: guard(() => {
          throw authThrow({ code: "AUTH_LOGIN_REQUIRED" });
        }),
      },
      {
        key: "auth-cancelled",
        label: "Auth • Cancelled",
        action: guard(() => {
          throw authThrow({ code: "AUTH_CANCELLED" });
        }),
      },
      {
        key: "auth-request-failed",
        label: "Auth • Request failed",
        action: guard(() => {
          throw authThrow({ code: "AUTH_REQUEST_FAILED", status: 500 });
        }),
      },
    ],
    []
  );

  const validationExamples = useMemo<ExampleConfig[]>(
    () => [
      {
        key: "validation-required",
        label: "Validation • Required",
        action: guard(() => {
          throw validationThrow({ code: "VALIDATION_REQUIRED" });
        }),
      },
      {
        key: "validation-pattern",
        label: "Validation • Pattern mismatch",
        action: guard(() => {
          throw validationThrow({ code: "VALIDATION_PATTERN_MISMATCH" });
        }),
      },
      {
        key: "validation-range",
        label: "Validation • Out of range",
        action: guard(() => {
          throw validationThrow({ code: "VALIDATION_OUT_OF_RANGE" });
        }),
      },
      {
        key: "validation-unique",
        label: "Validation • Unique constraint",
        action: guard(() => {
          throw validationThrow({ code: "VALIDATION_UNIQUE" });
        }),
      },
      {
        key: "validation-conflict",
        label: "Validation • Conflict",
        action: guard(() => {
          throw validationThrow({ code: "VALIDATION_CONFLICT" });
        }),
      },
    ],
    []
  );

  const networkExamples = useMemo<ExampleConfig[]>(
    () => [
      {
        key: "network-offline",
        label: "Network • Offline",
        action: guard(() => {
          throw networkThrow({ status: 0, retryable: false });
        }),
      },
      {
        key: "network-404",
        label: "Network • 404 Not Found",
        action: guard(() => {
          throw networkThrow(404);
        }),
      },
      {
        key: "network-500",
        label: "Network • 500 Server error",
        action: guard(() => {
          throw networkThrow(500);
        }),
      },
      {
        key: "network-retryable",
        label: "Network • Retryable timeout",
        action: guard(() => {
          throw networkThrow({ status: 503, retryable: true, attempt: 1 });
        }),
      },
    ],
    []
  );

  const invariantExamples = useMemo<ExampleConfig[]>(
    () => [
      {
        key: "invariant-state",
        label: "Invariant • State corrupted",
        action: guard(() => {
          throw invariantThrow({ code: "INVARIANT_STATE_CORRUPTED" });
        }),
        actionStyle: "negative",
      },
      {
        key: "invariant-unreachable",
        label: "Invariant • Unreachable",
        action: guard(() => {
          throw invariantThrow({ code: "INVARIANT_UNREACHABLE" });
        }),
        actionStyle: "negative",
      },
      {
        key: "invariant-unsupported",
        label: "Invariant • Unsupported feature",
        action: guard(() => {
          throw invariantThrow({ code: "INVARIANT_UNSUPPORTED" });
        }),
        actionStyle: "negative",
      },
    ],
    []
  );

  const miscExamples = useMemo<ExampleConfig[]>(
    () => [
      {
        key: "render-bug",
        label: "Render • Trigger component crash",
        action: guard(() => setShowBuggyComponent(true)),
        actionStyle: "negative",
      },
      {
        key: "unguarded-throw",
        label: "Throw • Unguarded Error",
        action: () => {
          throw new Error("A wild error instance appeared!");
        },
        actionStyle: "negative",
      },
    ],
    []
  );

  const callSandboxApi = useCallback(
    async ({ url, method = "GET", body }: SandboxCallArgs) => {
      const shouldThrow =
        typeof body === "object" && body !== null
          ? Boolean((body as { throwError?: boolean }).throwError)
          : false;

      const status = resolveSandboxStatus(url, shouldThrow);
      const isFallbackBase = SANDBOX_API_BASE_URL === SANDBOX_FALLBACK_BASE_URL;
      const sleep = status >= 500 ? 1400 : 650;
      const targetUrl = isFallbackBase ? `/${status}?sleep=${sleep}` : url;

      try {
        const response = await sandboxHttp.request({
          url: targetUrl,
          method,
          data: body,
        });
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          throw networkError(error.message || "Sandbox request failed", {
            status: error.response?.status ?? status,
            method,
            url,
            retryable: error.code === "ECONNABORTED",
            metadata: { simulatedUrl: targetUrl },
          });
        }
        throw error;
      }
    },
    []
  );

  const sandboxExamples = useMemo<ExampleConfig[]>(
    () => [
      {
        key: "sandbox-success",
        label: "Sandbox API • Success",
        action: guard(async () => {
          try {
            const response = await callSandboxApi({
              url: "/users/sandbox/test",
              method: "POST",
              body: { throwError: false },
            });
            console.log(
              "Sandbox API • Success => response",
              response ?? "(no payload)"
            );
            showSandboxToast(
              "success",
              "Sandbox call succeeded",
              "Test endpoint responded successfully."
            );
          } catch (error) {
            console.error("Sandbox API • Success → failure", error);
            showSandboxToast(
              "error",
              "Sandbox call failed",
              "Check logs for the error details."
            );
            throw error;
          }
        }),
        actionStyle: "positive",
      },
      {
        key: "sandbox-failure",
        label: "Sandbox API • Failure",
        action: guard(async () => {
          await callSandboxApi({
            url: "/users/sandbox/test",
            method: "POST",
            body: { throwError: true },
          });
        }),
        actionStyle: "negative",
      },
      {
        key: "sandbox-login",
        label: "Sandbox API • Login",
        action: guard(async () => {
          await callSandboxApi({
            url: "/auth/login",
            method: "POST",
          });
        }),
        actionStyle: "primary",
      },
    ],
    [callSandboxApi, showSandboxToast]
  );

  return (
    <ScreenView>
      <Box className="gap-5 p-4">
        <ExampleSection title="Authentication Errors" examples={authExamples} />
        <ExampleSection
          title="Validation Errors"
          examples={validationExamples}
        />
        <ExampleSection title="Network Errors" examples={networkExamples} />
        <ExampleSection title="Invariant Errors" examples={invariantExamples} />
        <ExampleSection title="Sandbox API Calls" examples={sandboxExamples} />
        <ExampleSection title="Miscellaneous" examples={miscExamples} />
        {showBuggyComponent && (
          <BuggyComponent
            onCrashComplete={() => setShowBuggyComponent(false)}
          />
        )}
      </Box>
    </ScreenView>
  );
}

function ExampleSection({
  title,
  examples,
}: {
  title: string;
  examples: ExampleConfig[];
}) {
  return (
    <Box className="gap-3">
      <Text className="text-base font-semibold">{title}</Text>
      {examples.map(({ key, label, action, actionStyle = "primary" }) => (
        <Button key={key} action={actionStyle} onPress={action}>
          <ButtonText>{label}</ButtonText>
        </Button>
      ))}
    </Box>
  );
}

function BuggyComponent({ onCrashComplete }: { onCrashComplete: () => void }) {
  useEffect(() => {
    onCrashComplete();
    throw new Error("Buggy component intentionally crashed");
  }, [onCrashComplete]);

  return (
    <Box className="mt-4">
      <Text className="text-base font-semibold">
        Buggy component (throws render error)
      </Text>
      <Text>
        This component is mounted only after pressing the crash button and then
        throws to exercise the error boundary.
      </Text>
    </Box>
  );
}
