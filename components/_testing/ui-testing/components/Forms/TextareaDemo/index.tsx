import { Textarea, TextareaInput } from '@/components/ui/textarea';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const TextareaDemo = () => {
  return (
    <ComponentSnippet
      title="Textarea"
      example={
        <Textarea size={'lg'} isInvalid={false} isDisabled={false} className="w-64">
          <TextareaInput placeholder="Your text goes here..." />
        </Textarea>
      }
      snippet="gs-TextareaBasic-lg"
      warnings={'Resizable is not supported.'}
    />
  );
};

export default TextareaDemo;
