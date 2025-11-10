import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import React from 'react';

const SectionHeading = ({
  id,
  title,
  notes,
}: {
  id: string;
  title: string;
  notes?: React.ReactNode;
}) => {
  return (
    <>
      <Heading id={id} size={'3xl'}>
        {title}
      </Heading>
      <Text>{notes}</Text>
      <Divider className="mb-4" />
    </>
  );
};

export default SectionHeading;
