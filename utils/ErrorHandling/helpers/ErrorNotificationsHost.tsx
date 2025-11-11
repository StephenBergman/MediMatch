import { Button, ButtonText } from "@/components/ui/button";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { Platform } from "react-native";
import type { UxDecision } from "utils/ErrorHandling/errors/policy";
import { registerUxNotifier } from "utils/ErrorHandling/helpers/capture";

/**
 * Registers a centered, dismissible toast as the default UX notifier for non-escalated errors.
 *
 * Wrap the app with this component (beneath GluestackUIProvider) so guardAsync can surface
 * messages automatically without each screen re-implementing toast logic.
 */
export function ErrorNotificationsHost({ children }: PropsWithChildren) {
  const toast = useToast();

  const notify = useMemo(
    () => (ux: UxDecision) => {
      if (ux.escalate) return;

      const action = ux.intent ?? "error";
      const title = ux.title ?? "An error occurred";
      toast.show({
        placement: Platform.OS === "web" ? "top" : "bottom",
        duration: null,
        render: ({ id }) => (
          <Toast
            nativeID={`toast-${id}`}
            variant="outline"
            action={action}
            className="max-w-lg items-stretch"
          >
            <VStack space="xs">
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{ux.userMessage}</ToastDescription>
              <Button variant="link" onPress={() => toast.close(id)}>
                <ButtonText>Close</ButtonText>
              </Button>
            </VStack>
          </Toast>
        ),
      });
    },
    [toast]
  );

  // Ensure notifier is available immediately during render so the first guard call can emit a toast.
  useEffect(() => {
    registerUxNotifier(notify);
    return () => registerUxNotifier(null);
  }, [notify]);

  return <>{children}</>;
}
