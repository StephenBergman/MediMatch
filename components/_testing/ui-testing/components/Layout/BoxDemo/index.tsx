import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const BoxDemo = () => {
  return (
    <ComponentSnippet
      title="Box"
      snippet="gs-BoxBasic"
      example={
        <Box className={`h-[100px] bg-blue-500`}>
          <Text className="font-bold">This is a box</Text>
        </Box>
      }
      notes={'Use as a replacement for <View/> and <div/> elements.'}
    />
  );
};

export default BoxDemo;
