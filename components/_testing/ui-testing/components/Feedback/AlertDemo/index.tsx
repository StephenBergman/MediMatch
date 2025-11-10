import { Alert, AlertIcon, AlertText } from '@/components/ui/alert';
import { InfoIcon } from '@/components/ui/icon';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const AlertDemo = () => {
  return (
    <ComponentSnippet
      title="Alert"
      snippet="gs-AlertBasic-accent"
      example={
        <Alert variant={'solid'} action={'success'} className="gap-3">
          <AlertIcon as={InfoIcon} />
          <AlertText>Selection successfully moved!</AlertText>
        </Alert>
      }
    />
  );
};

export default AlertDemo;
