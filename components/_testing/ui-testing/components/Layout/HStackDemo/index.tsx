import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const HStackDemo = () => {
  return (
    <ComponentSnippet
      title="HStack"
      snippet="gs-HStackBasicHStack"
      example={
        <HStack space="md">
          <Box className="h-16 w-16 bg-primary-300" />
          <Box className="h-16 w-16 bg-primary-400" />
          <Box className="h-16 w-16 bg-primary-500" />
        </HStack>
      }
      notes={'Use instead of a <Box/> with horizontal flex styles.'}
    />
  );
};

export default HStackDemo;
