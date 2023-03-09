import { useState } from 'react';
import type { DimensionObject } from './type';

const useDimension = (w: number = 0, h: number = 0): DimensionObject => {
  const [width, setWidth] = useState(w);
  const [height, setHeight] = useState(h);

  const update = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
  };


  return {
    width,
    height,
    update,
  };
};

export default useDimension;
