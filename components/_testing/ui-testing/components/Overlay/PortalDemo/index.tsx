import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { CloseIcon } from "@/components/ui/icon";
import { Portal } from "@/components/ui/portal";
import React, { useState } from "react";
import { Text } from "react-native";
import ComponentSnippet from "../../ComponentSnippet";

const PortalDemo = () => {
  const [showPortal, setShowPortal] = useState(false);
  return (
    <ComponentSnippet
      title="Portal"
      example={
        <>
          <Portal isOpen={showPortal} className="items-center justify-center">
            <HStack className="w-1/3 flex-row items-center justify-center gap-4 rounded-lg border-2 bg-background-0 py-10">
              <Text className="italic text-typography-950">
                ~Custom Portal Content~
              </Text>
              <Button
                size="xs"
                className="absolute right-2 top-2 h-6 px-1"
                variant="outline"
                onPress={() => setShowPortal(false)}
              >
                <ButtonIcon as={CloseIcon} />
              </Button>
            </HStack>
          </Portal>
          <Button onPress={() => setShowPortal(!showPortal)}>
            <ButtonText>Toggle Portal</ButtonText>
          </Button>
        </>
      }
      snippet="gs-PortalBasic"
      notes="Portals render custom content outside of the DOM."
    />
  );
};

export default PortalDemo;
