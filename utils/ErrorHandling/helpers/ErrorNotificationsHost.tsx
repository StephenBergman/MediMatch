import { PropsWithChildren, useEffect, useMemo } from "react";
import type { UxDecision } from "utils/ErrorHandling/errors/policy";
import { registerUxNotifier } from "utils/ErrorHandling/helpers/capture";
import { useAppToast } from "@/components/common/AppToastProvider";

/**
 * Registers a centered, dismissible toast as the default UX notifier for non-escalated errors.
 *
 * Wrap the app with this component (beneath GluestackUIProvider) so guardAsync can surface
 * messages automatically without each screen re-implementing toast logic.
 */
export function ErrorNotificationsHost({ children }: PropsWithChildren) {
  const { showToast } = useAppToast();

  const notify = useMemo(
    () => (ux: UxDecision) => {
      if (ux.escalate) return;

      showToast(ux.userMessage ?? ux.title ?? "An error occurred");
    },
    [showToast]
  );

  // Ensure notifier is available immediately during render so the first guard call can emit a toast.
  useEffect(() => {
    registerUxNotifier(notify);
    return () => registerUxNotifier(null);
  }, [notify]);

  return <>{children}</>;
}
