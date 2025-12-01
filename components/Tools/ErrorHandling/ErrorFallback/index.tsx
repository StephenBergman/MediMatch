import ScreenView from "@/components/Tools/ScreenView";
import React from "react";
import { ScrollView } from "react-native";
import {
  Button,
  Card,
  List,
  Text,
  useTheme,
} from "react-native-paper";

type ErrorFallbackProps = {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  origin?: string;
  onRetry?(): void;
  onReport?(): void;
};

function getComponentStackPreview(stack?: string) {
  if (!stack) return "";
  return stack
    .split("\n")
    .map((line) => {
      const words = line.trim().split(/\s+/);
      return words.slice(0, 2).join(" ");
    })
    .join("\n");
}

function getStacktracePreview(stack?: string) {
  if (!stack) return "";
  const [, ...rest] = stack.split("\n");
  return rest
    .map((line) => {
      const words = line.trim().split(/\s+/);
      return words.slice(0, 2).join(" ");
    })
    .join("\n");
}

const errorMessages = [
  "Bugs ate our wires!",
  "Gremlins in the code—please stand by.",
  "Coffee spill detected. Try again!",
  "The internet gnomes misplaced something important.",
];

export function ErrorFallback({
  error,
  errorInfo,
  origin,
  onRetry,
  onReport,
}: ErrorFallbackProps) {
  const theme = useTheme();
  const randomMsg =
    errorMessages[Math.floor(Math.random() * errorMessages.length)];
  const message = error?.message ?? "Something unexpected happened.";

  const displayOrigin =
    origin ??
    (() => {
      const line = errorInfo?.componentStack?.split("\n")[1];
      if (!line) return undefined;
      const [, maybeOrigin] = line.trim().split(/\s+/);
      return maybeOrigin;
    })();

  return (
    <ScreenView padded centered>
      <Card style={{ width: "100%", maxWidth: 900 }}>
        <Card.Title title="Oops!" subtitle={randomMsg} />
        <Card.Content style={{ gap: 12 }}>
          {error && process.env.NODE_ENV === "development" && (
            <ScrollView style={{ maxHeight: 300 }}>
              <List.Section>
                <List.Item
                  title="Error message"
                  description={`${message}${displayOrigin ? `\n@origin: ${displayOrigin}` : ""}`}
                />
                {errorInfo?.componentStack && (
                  <List.Accordion title="Component Stack (Preview)">
                    <Text variant="bodySmall" style={{ fontFamily: "monospace" }}>
                      {getComponentStackPreview(errorInfo.componentStack)}
                    </Text>
                  </List.Accordion>
                )}
                {error?.stack && (
                  <List.Accordion title="Stacktrace (Preview)">
                    <Text variant="bodySmall" style={{ fontFamily: "monospace" }}>
                      {getStacktracePreview(error.stack)}
                    </Text>
                  </List.Accordion>
                )}
              </List.Section>
            </ScrollView>
          )}
        </Card.Content>
        <Card.Actions>
          {onReport && (
            <Button onPress={onReport} mode="outlined">
              Report bug
            </Button>
          )}
          {onRetry && (
            <Button onPress={onRetry} mode="contained" style={{ marginLeft: 8 }}>
              Try again
            </Button>
          )}
        </Card.Actions>
      </Card>
    </ScreenView>
  );
}
