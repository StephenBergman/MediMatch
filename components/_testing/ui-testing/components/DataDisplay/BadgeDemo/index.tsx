import { Badge, BadgeIcon, BadgeText } from '@/components/ui/badge';
import { CheckIcon } from '@/components/ui/icon';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const BadgeDemo = () => {
  return (
    <ComponentSnippet
      title="Badge"
      snippet="gs-BadgeBasic-info"
      example={
        <Badge variant={'solid'} action={'success'} size={'md'}>
          <BadgeText>Verified</BadgeText>
          <BadgeIcon as={CheckIcon} className="ml-2" />
        </Badge>
      }
    />
  );
};

export default BadgeDemo;
