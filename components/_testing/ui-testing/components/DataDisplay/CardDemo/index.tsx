import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const CardDemo = () => {
  return (
    <ComponentSnippet
      title="Card"
      snippet="gs-CardBasicCard"
      example={
        <Card size={'lg'} variant={'filled'}>
          <Heading size="md" className={'mb-1'}>
            Quick Start
          </Heading>
          <Text size="sm">Start building your next project in minutes</Text>
        </Card>
      }
    />
  );
};

export default CardDemo;
