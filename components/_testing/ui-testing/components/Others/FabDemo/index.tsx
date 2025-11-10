import { Box } from '@/components/ui/box';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { AddIcon } from '@/components/ui/icon';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const FabDemo = () => {
  return (
    <ComponentSnippet
      title="Fab"
      example={
        <Box className="h-[230px] w-60 rounded-md bg-background-50">
          <Fab
            size="sm"
            placement="bottom right"
            isHovered={false}
            isDisabled={false}
            isPressed={false}
          >
            <FabIcon as={AddIcon} />
            <FabLabel>New Post</FabLabel>
          </Fab>
        </Box>
      }
      snippet="gs-FabBasic-lg"
      notes="FAB stands for 'Floating Action Button'."
    />
  );
};

export default FabDemo;
