import { CircleIcon } from '@/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const RadioDemo = () => {
  return (
    <ComponentSnippet
      title="Radio"
      example={
        <RadioGroup>
          <Radio value="Label 1" aria-label="Radio">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Label 1</RadioLabel>
          </Radio>
          <Radio value="Label 2" aria-label="Radio">
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>Label 2</RadioLabel>
          </Radio>
        </RadioGroup>
      }
      snippet="gs-RadioBasic-lg"
      warnings={'RadioGroup does not need a value prop.'}
    />
  );
};

export default RadioDemo;
