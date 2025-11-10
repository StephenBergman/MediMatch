import { Image } from '@/components/ui/image';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const ImageDemo = () => {
  return (
    <ComponentSnippet
      title="Image"
      example={
        <Image
          alt="spongebob flowers"
          size="none"
          source={{
            uri: 'https://static.wikia.nocookie.net/spongebob/images/5/5f/Pressure_006.png',
          }}
          className="aspect-[4/3] w-full max-w-[320px]"
        />
      }
      snippet="gs-ImageBasic"
      notes="Use className to set dimensions and aspect ratio."
    />
  );
};

export default ImageDemo;
