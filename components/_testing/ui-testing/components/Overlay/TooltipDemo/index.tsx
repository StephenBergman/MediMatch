import { Button, ButtonText } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipText } from '@/components/ui/tooltip';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const TooltipDemo = () => {
  return (
    <ComponentSnippet
      title="Tooltip"
      example={
        <Tooltip
          placement={'top'}
          trigger={(triggerProps: any) => {
            return (
              <Button {...triggerProps}>
                <ButtonText>Hover</ButtonText>
              </Button>
            );
          }}
        >
          <TooltipContent>
            <TooltipText>Tooltip!</TooltipText>
          </TooltipContent>
        </Tooltip>
      }
      snippet="gs-TooltipBasic"
    />
  );
};

export default TooltipDemo;
