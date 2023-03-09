import type { SharedValue } from 'react-native-reanimated';

export type DimensionObject = {
  width: number;
  height: number;
  update: (w: number, h: number) => void;
};

export type AnimatedDimensionObject = {
  width: SharedValue<number>;
  height: SharedValue<number>;
};
