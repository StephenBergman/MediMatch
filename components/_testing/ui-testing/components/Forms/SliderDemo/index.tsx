import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@/components/ui/slider';
import React, { useState } from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const SliderDemo = () => {
  const [sliderDemo, setSliderDemo] = useState(50);
  return (
    <ComponentSnippet
      title="Slider"
      example={
        <Slider
          size={'lg'}
          orientation={'horizontal'}
          isDisabled={false}
          value={sliderDemo}
          onChange={(value: number) => {
            setSliderDemo(value);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      }
      snippet="gs-SliderBasic-lg"
    />
  );
};

export default SliderDemo;
