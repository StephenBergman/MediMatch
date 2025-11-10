import { Button, ButtonText } from '@/components/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import ComponentSnippet from '../../ComponentSnippet';

const DrawerDemo = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <ComponentSnippet
      title="Drawer"
      example={
        <>
          <Button
            onPress={() => {
              setShowDrawer(true);
            }}
          >
            <ButtonText>Open Drawer</ButtonText>
          </Button>
          <Drawer
            isOpen={showDrawer}
            onClose={() => setShowDrawer(false)}
            size={Platform.OS === 'web' ? 'sm' : 'lg'}
          >
            <DrawerBackdrop />
            <DrawerContent className="overflow-hidden">
              <DrawerHeader>
                <Heading>Drawer Title</Heading>
                <DrawerCloseButton>
                  <Icon as={CloseIcon} size="lg" />
                </DrawerCloseButton>
              </DrawerHeader>
              <DrawerBody>
                <Text>This is the content of the drawer. You can put any components here.</Text>
              </DrawerBody>
              <DrawerFooter className="gap-3">
                <Button variant="outline" action="secondary" onPress={() => setShowDrawer(false)}>
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button action="positive" onPress={() => setShowDrawer(false)}>
                  <ButtonText>Save</ButtonText>
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      }
      snippet="NO SNIPPET"
      badSnippet
    />
  );
};

export default DrawerDemo;
