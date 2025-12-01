import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Surface, Text } from "react-native-paper";

type ToastOptions = {
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

type ToastState = {
  id: number;
  message: string;
  duration: number;
} & ToastOptions;

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void;
};

const AppToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const useAppToast = () => useContext(AppToastContext);

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const translateY = useRef(new Animated.Value(100)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentToastIdRef = useRef<number | null>(null);

  const hideToast = useCallback(
    (targetId?: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const toastId = targetId ?? currentToastIdRef.current;
      if (!toastId) {
        setToast(null);
        return;
      }

      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && currentToastIdRef.current === toastId) {
          setToast(null);
          currentToastIdRef.current = null;
        }
      });
    },
    [translateY]
  );

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      setToast({
        id: Date.now(),
        message,
        duration: options?.duration ?? 3500,
        ...options,
      });
    },
    []
  );

  useEffect(() => {
    currentToastIdRef.current = toast?.id ?? null;
  }, [toast]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    translateY.stopAnimation();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    timeoutRef.current = setTimeout(() => {
      hideToast(toast.id);
    }, toast.duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [toast, translateY, hideToast]);

  const handleAction = useCallback(() => {
    toast?.onAction?.();
    if (toast?.id) {
      hideToast(toast.id);
    } else {
      hideToast();
    }
  }, [toast, hideToast]);

  return (
    <AppToastContext.Provider value={{ showToast }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast ? (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.toastContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <Surface elevation={3} style={styles.toastSurface}>
              <Text variant="bodyMedium" style={{ color: "#fff" }}>
                {toast.message}
              </Text>
              {toast.actionLabel ? (
                <Button style={styles.toastButton} onPress={handleAction}>
                  {toast.actionLabel}
                </Button>
              ) : null}
            </Surface>
          </Animated.View>
        ) : null}
      </View>
    </AppToastContext.Provider>
  );
}

const Button = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) => (
  <Text
    onPress={onPress}
    variant="labelLarge"
    style={{ color: "#BBDEFB", marginLeft: 12 }}
  >
    {children}
  </Text>
);

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    zIndex: 1000,
  } as ViewStyle,
  toastSurface: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#323232",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toastButton: {
    marginLeft: 12,
  },
});
