import { Spinner } from '@/components/ui/spinner';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const SpinnerDemo = () => {
  return (
    <ComponentSnippet
      title="Spinner"
      snippet="gs-SpinnerBasic-lg"
      example={<Spinner size={'large'} color={'gray'} />}
    />
  );
};

export default SpinnerDemo;
