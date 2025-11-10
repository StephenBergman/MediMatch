import { Text } from '@/components/ui/text';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const TextDemo = () => {
  return (
    <ComponentSnippet title="Text" snippet="gs-TextBasic" example={<Text>Hello World!</Text>} />
  );
};

export default TextDemo;
