import ScreenView from "@/components/Tools/ScreenView";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Icon,
  InfoIcon,
} from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React from "react";
import { ScrollView } from "react-native";

/**
 * Renders a user-facing fallback screen when the error boundary catches a fatal issue.
 *
 * @param error Optional error instance to surface.
 * @param errorInfo Optional error info with component stack trace.
 * @param origin Optional string indicating the origin of the error for context.
 * @param onRetry Handler to attempt recovery/navigation.
 * @param onReport Handler to launch feedback flow.
 */
export function ErrorFallback({
  error,
  errorInfo,
  origin,
  onRetry,
  onReport,
}: {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  origin?: string;
  onRetry?(): void;
  onReport?(): void;
}) {
  const message = error?.message ?? "Something unexpected happened.";

  const errorMessages = [
    "Bugs ate our wires!",
    "Gremlins in the code—please stand by.",
    "The hamsters powering this app took a break.",
    "Coffee spill detected. Try again!",
    "Our bits and bytes are tangled up.",
    "The internet gnomes misplaced something important.",
    "Well, this is awkward. Something went kaboom.",
    "The robots forgot their lines.",
    "Unicorns ran off with your data.",
    "Looks like the matrix glitched. Reload and retry!",
  ];
  const randomMsg =
    errorMessages[Math.floor(Math.random() * errorMessages.length)];

  /**
   * Returns a string with only the first two words of each line in the component stack.
   * @param stack The component stack string
   */
  function getComponentStackPreview(stack?: string): string {
    if (!stack) return "";
    return stack
      .split("\n")
      .map((line) => {
        const words = line.trim().split(/\s+/);
        return words.slice(0, 2).join(" ");
      })
      .join("\n");
  }

  /**
   * Returns a string with only the first two words of each line in the stacktrace, skipping the first line.
   * @param stack The stacktrace string
   */
  function getStacktracePreview(stack?: string): string {
    if (!stack) return "";
    const lines = stack.split("\n");
    return lines
      .slice(1) // skip the first line
      .map((line) => {
        const words = line.trim().split(/\s+/);
        return words.slice(0, 2).join(" ");
      })
      .join("\n");
  }

  // Returns the second word of the second line in the component stack, if available
  let displayOrigin = origin;
  if (!displayOrigin && errorInfo?.componentStack) {
    const lines = errorInfo.componentStack.split("\n");
    if (lines[1]) {
      const words = lines[1].trim().split(/\s+/);
      displayOrigin = words[1] || undefined;
    }
  }

  return (
    <ScreenView padded centered>
      <Card
        variant={"filled"}
        className="max-h-[80vh] w-full min-w-[200px] max-w-[900px]"
      >
        <Heading size="md" className={"mb-1"}>
          Oops!
        </Heading>
        <Text size="sm">{randomMsg}</Text>
        {error && process.env.NODE_ENV === "development" && (
          <Card size="md" variant="outline" className="mt-4 max-h-[50vh]">
            <Alert variant={"solid"} action={"error"} className="gap-3">
              <AlertIcon as={InfoIcon} />
              <AlertText>
                {message.toString()}
                {displayOrigin && (
                  <>
                    {"\n"}@origin: {displayOrigin}
                  </>
                )}
              </AlertText>
            </Alert>
            <ScrollView className="max-w-full">
              <Box className="p-2">
                <Text size="xs" className="mt-1 italic text-secondary-950">
                  View full details in the developer console.
                </Text>
                {errorInfo?.componentStack && (
                  <Accordion type="single" className="mt-4 w-full">
                    <AccordionItem value="component-stack">
                      <AccordionHeader>
                        <AccordionTrigger>
                          {({ isExpanded }: { isExpanded: boolean }) => {
                            return (
                              <>
                                <Text size="xs" className="font-bold">
                                  Component Stack (Preview)
                                </Text>
                                <Icon
                                  as={
                                    isExpanded ? ChevronUpIcon : ChevronDownIcon
                                  }
                                />
                              </>
                            );
                          }}
                        </AccordionTrigger>
                      </AccordionHeader>
                      <AccordionContent>
                        <Box className="w-full">
                          <Text
                            size="xs"
                            className="font-mono whitespace-pre-wrap break-all"
                          >
                            {getComponentStackPreview(errorInfo.componentStack)}
                          </Text>
                        </Box>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
                {error?.stack && (
                  <Accordion type="single" className="mt-4 w-full">
                    <AccordionItem value="component-stack">
                      <AccordionHeader>
                        <AccordionTrigger>
                          {({ isExpanded }: { isExpanded: boolean }) => {
                            return (
                              <>
                                <Text size="xs" className="font-bold">
                                  Stacktrace (Preview)
                                </Text>
                                <Icon
                                  as={
                                    isExpanded ? ChevronUpIcon : ChevronDownIcon
                                  }
                                />
                              </>
                            );
                          }}
                        </AccordionTrigger>
                      </AccordionHeader>
                      <AccordionContent>
                        <Box className="w-full">
                          <Text
                            size="xs"
                            className="font-mono whitespace-pre-wrap break-all"
                          >
                            {getStacktracePreview(error.stack)}
                          </Text>
                        </Box>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </Box>
            </ScrollView>
          </Card>
        )}
        <Button
          className="mt-4"
          action={"primary"}
          variant={"solid"}
          size={"lg"}
          isDisabled={false}
          onPress={() => {
            if (typeof window !== "undefined" && window.location) {
              window.location.reload();
            }
          }}
        >
          <ButtonText>Reload</ButtonText>
        </Button>
      </Card>
    </ScreenView>
  );
}
