import { Heading } from '@/components/ui/heading';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const HeadingDemo = () => {
  return (
    <ComponentSnippet
      title="Heading"
      snippet="gs-HeadingBasic-2xl"
      example={<Heading size="2xl">Hello World!</Heading>}
    />
  );
};

export default HeadingDemo;
