import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { reportFeedback } from "utils/ErrorHandling/helpers/capture";

/**
 * Modal for collecting optional contact info and a short bug report from the user.
 *
 * @param open Controls visibility.
 * @param onClose Invoked when the modal should close.
 */
export function FeedbackModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit() {
    try {
      await reportFeedback({ email, message });
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="success" variant="solid">
            <ToastTitle>Thanks!</ToastTitle>
            <ToastDescription>Bug report submitted.</ToastDescription>
          </Toast>
        ),
      });
      onClose();
      setEmail("");
      setMessage("");
    } catch {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="solid">
            <ToastTitle>Uh oh</ToastTitle>
            <ToastDescription>Please try again.</ToastDescription>
          </Toast>
        ),
      });
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalContent className="w-[90%] max-w-md self-center">
        <ModalHeader>
          <Text className="text-lg font-semibold text-typography-900">
            Report this issue?
          </Text>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            <Textarea size="md" className="w-full">
              <TextareaInput
                placeholder="Email (optional)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Textarea>
            <Textarea size="md" className="w-full">
              <TextareaInput
                placeholder="What went wrong?"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
              />
            </Textarea>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack space="sm" className="w-full">
            <Button className="flex-1" onPress={onClose}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button className="flex-1" action="primary" onPress={onSubmit}>
              <ButtonText>Submit</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
