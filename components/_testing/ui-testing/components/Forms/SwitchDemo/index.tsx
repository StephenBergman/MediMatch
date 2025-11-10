import { Switch } from '@/components/ui/switch';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const SwitchDemo = () => {
  return (
    <ComponentSnippet
      title="Switch"
      example={
        <Switch
          trackColor={{
            false: 'lightgrey',
            true: '#43a25a',
          }}
          thumbColor={'white'}
          activeThumbColor={'white'}
          ios_backgroundColor={'lightgrey'}
          size={'lg'}
        />
      }
      snippet="gs-SwitchBasic-lg"
    />
  );
};

export default SwitchDemo;
