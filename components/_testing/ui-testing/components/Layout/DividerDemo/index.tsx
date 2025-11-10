import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const DividerDemo = () => {
  return (
    <ComponentSnippet
      title="Divider"
      snippet="gs-DividerBasic-horizontal"
      example={
        <VStack className={`w-full gap-2.5 p-4`}>
          <Heading size="3xl" className="font-semibold">
            Program Output
          </Heading>
          <Divider orientation={'horizontal'} className="mb-2 mt-4" />
          <Heading size="sm" className="font-semibold">
            Hello World!
          </Heading>
        </VStack>
      }
      example2={
        <HStack className={`w-full gap-2.5 p-4`}>
          <Text>Home</Text>
          <Divider orientation="vertical" className="mx-2" />
          <Text>Profile</Text>
          <Divider orientation="vertical" className="mx-2" />
          <Text>Settings</Text>
        </HStack>
      }
      notes={'The Divider can be oriented vertically or horizontally using the orientation prop.'}
    />
  );
};

export default DividerDemo;
