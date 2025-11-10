import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { CloseIcon, Icon } from '@/components/ui/icon';
import {
  Popover,
  PopoverArrow,
  PopoverBackdrop,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from '@/components/ui/popover';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const PopoverDemo = () => {
  const [showPopover, setShowPopover] = useState(false);
  return (
    <ComponentSnippet
      title="Popover"
      example={
        <Popover
          size={'lg'}
          shouldFlip
          isOpen={showPopover}
          onOpen={() => {
            setShowPopover(true);
          }}
          onClose={() => {
            setShowPopover(false);
          }}
          trigger={(triggerProps) => {
            return (
              <Button {...triggerProps}>
                <ButtonText>Popover</ButtonText>
              </Button>
            );
          }}
        >
          <PopoverBackdrop />
          <PopoverContent className="max-w-[400]">
            <PopoverArrow />
            <PopoverHeader>
              <Heading>Welcome!</Heading>
              <PopoverCloseButton>
                <Icon as={CloseIcon} size="lg" />
              </PopoverCloseButton>
            </PopoverHeader>
            <PopoverBody>
              <Text>
                Join the product tour and start creating your own checklist. Are you ready to jump
                in?
              </Text>
            </PopoverBody>
            <PopoverFooter>
              <Text size="xs" className="flex-1">
                Step 2 of 3
              </Text>
              {}
              <Button
                variant="outline"
                action="secondary"
                className="mr-3"
                onPress={() => {
                  setShowPopover(false);
                }}
              >
                <ButtonText>Back</ButtonText>
              </Button>
              <Button
                onPress={() => {
                  setShowPopover(false);
                }}
              >
                <ButtonText>Next</ButtonText>
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      }
      snippet="gs-PopoverBasic"
    />
  );
};

export default PopoverDemo;
