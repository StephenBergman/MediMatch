import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const CenterDemo = () => {
  return (
    <ComponentSnippet
      title="Center"
      snippet="gs-CenterBasic"
      example={
        <Center className={`h-[100px] bg-blue-500`}>
          <Text className="font-bold">This is a center</Text>
        </Center>
      }
      notes={'Use instead of a <Box/> with centering styles.'}
    />
  );
};

export default CenterDemo;
