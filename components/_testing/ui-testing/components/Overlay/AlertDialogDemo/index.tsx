import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const AlertDialogDemo = () => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  return (
    <ComponentSnippet
      title="AlertDialog"
      example={
        <>
          <Button onPress={() => setShowAlertDialog(true)}>
            <ButtonText>Click me</ButtonText>
          </Button>
          <AlertDialog
            isOpen={showAlertDialog}
            onClose={() => setShowAlertDialog(false)}
            size={'lg'}
          >
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading>Return Policy</Heading>
                <AlertDialogCloseButton>
                  <Icon as={CloseIcon} size="lg" />
                </AlertDialogCloseButton>
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text>
                  Whoa, slow down there! This modal is like a red light at an intersection,
                  reminding you to stop and think before you proceed. Is deleting this folder the
                  right choice?
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter className="gap-3">
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={() => setShowAlertDialog(false)}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button action="negative" onPress={() => setShowAlertDialog(false)}>
                  <ButtonText>Delete</ButtonText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      }
      snippet="gs-AlertDialogBasic-lg"
    />
  );
};

export default AlertDialogDemo;
