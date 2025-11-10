import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const CheckboxDemo = () => {
  return (
    <ComponentSnippet
      title="Checkbox"
      snippet="gs-CheckboxGroupBasic-lg"
      example={
        <Checkbox size={'lg'} isDisabled={false} isInvalid={false} value="checkbox-id">
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel>Label</CheckboxLabel>
        </Checkbox>
      }
    />
  );
};

export default CheckboxDemo;
