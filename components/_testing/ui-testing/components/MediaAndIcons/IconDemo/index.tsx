import { Icon, SearchIcon } from '@/components/ui/icon';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const IconDemo = () => {
  return (
    <ComponentSnippet
      title="Icon"
      example={<Icon as={SearchIcon} size={'lg'} />}
      snippet="gs-IconBasic-lg"
    />
  );
};

export default IconDemo;
