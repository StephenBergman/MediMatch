import { Grid, GridItem } from '@/components/ui/grid';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const GridDemo = () => {
  return (
    <ComponentSnippet
      title="Grid"
      snippet="gs-GridBasic"
      example={
        <Grid
          className="gap-4"
          _extra={{
            className: 'grid-cols-10',
          }}
        >
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-3',
            }}
          />
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-5',
            }}
          />
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-2',
            }}
          />
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-4',
            }}
          />
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-6',
            }}
          />
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-2',
            }}
          />
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-4',
            }}
          />
          <GridItem
            className="rounded-md bg-background-50 p-6"
            _extra={{
              className: 'col-span-4',
            }}
          />
        </Grid>
      }
    />
  );
};

export default GridDemo;
