import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const VStackDemo = () => {
  return (
    <ComponentSnippet
      title="VStack"
      snippet="gs-VStackBasicVStack"
      example={
        <VStack space="md">
          <Box className="h-16 w-16 bg-primary-300" />
          <Box className="h-16 w-16 bg-primary-400" />
          <Box className="h-16 w-16 bg-primary-500" />
        </VStack>
      }
      notes={'Use instead of a <Box/> with vertical flex styles.'}
    />
  );
};

export default VStackDemo;
