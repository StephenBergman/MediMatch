import { Button, ButtonText } from '@/components/ui/button';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const ButtonDemo = () => {
  return (
    <ComponentSnippet
      title="Button"
      snippet="gs-ButtonBasic-lg"
      example={
        <Button action={'primary'} variant={'solid'} size={'lg'} isDisabled={false}>
          <ButtonText>Hello World</ButtonText>
        </Button>
      }
    />
  );
};

export default ButtonDemo;
