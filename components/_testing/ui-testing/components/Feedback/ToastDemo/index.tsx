import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const ToastDemo = () => {
  const toast = useToast();
  return (
    <ComponentSnippet
      title="Toast"
      snippet="gs-ToastBasic-lg"
      example={
        <Button
          onPress={() => {
            toast.show({
              placement: 'top',
              duration: 3000,
              render: ({ id }) => {
                const toastId = `toast-${id}`;
                return (
                  <Toast nativeID={toastId} action={'info'} variant={'outline'}>
                    <ToastTitle>You pressed a button.</ToastTitle>
                    <HStack space="md">
                      <ToastDescription>This message will disappear in 3 seconds.</ToastDescription>
                      <Pressable onPress={() => toast.close(id)}>
                        <Icon as={CloseIcon} color="white" />
                      </Pressable>
                    </HStack>
                  </Toast>
                );
              },
            });
          }}
        >
          <ButtonText>Press Me</ButtonText>
        </Button>
      }
    />
  );
};

export default ToastDemo;
