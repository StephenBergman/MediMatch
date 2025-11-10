import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const SkeletonDemo = () => {
  return (
    <ComponentSnippet
      title="Skeleton"
      example={
        <Box className="w-[300px] gap-4 rounded-md bg-background-100 p-3">
          <Skeleton variant="sharp" className="h-[100px]" />
          <SkeletonText _lines={3} className="h-2" />
          <HStack className="w-full gap-1 align-middle">
            <Skeleton variant="circular" className="mr-2 h-[24px] w-[28px]" />
            <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
          </HStack>
        </Box>
      }
      snippet="gs-SkeletonBasic"
      notes="Use Skeleton for loading states."
    />
  );
};

export default SkeletonDemo;
