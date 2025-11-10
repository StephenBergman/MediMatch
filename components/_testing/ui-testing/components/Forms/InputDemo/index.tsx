import { SearchIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import React, { useState } from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const InputDemo = () => {
  const [inputDemo, setInputDemo] = useState('');
  return (
    <ComponentSnippet
      title="Input"
      snippet="gs-InputBasic-lg"
      example={
        <Input size={'lg'} variant={'outline'} isInvalid={false} isDisabled={false}>
          <InputField
            onChange={(e: any) => {
              setInputDemo(e.nativeEvent.text);
            }}
            value={inputDemo}
            placeholder="Enter Text here"
          />
          <InputSlot className="pr-4">
            <InputIcon as={SearchIcon} className="" />
          </InputSlot>
        </Input>
      }
    />
  );
};

export default InputDemo;
