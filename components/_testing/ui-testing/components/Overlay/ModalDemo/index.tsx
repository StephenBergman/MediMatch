import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const ModalDemo = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <ComponentSnippet
      title="Modal"
      example={
        <>
          <Button onPress={() => setShowModal(true)}>
            <ButtonText>Show Modal</ButtonText>
          </Button>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
            }}
          >
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Heading size="lg">Engage with Modals</Heading>
                <ModalCloseButton>
                  <Icon as={CloseIcon} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <Text>
                  Elevate user interactions with our versatile modals. Seamlessly integrate
                  notifications, forms, and media displays. Make an impact effortlessly.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="outline"
                  size="sm"
                  action="secondary"
                  className="mr-3"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  size="sm"
                  action="positive"
                  className="border-0"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  <ButtonText>Explore</ButtonText>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      }
      snippet="gs-ModalBasic"
    />
  );
};

export default ModalDemo;
