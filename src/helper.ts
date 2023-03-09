import type { SharedValue } from 'react-native-reanimated';

/**
 *
 * @param w width of SMALLEST view
 * @param h height of SMALLEST view
 * @param W width of BIGGEST view
 * @param H height of BIGGEST view
 * @returns
 */
export const upScale = (w: number, h: number, W: number, H: number) => {
  'worklet';
  if (!w || !h || !W || !H) {
    return {
      x: 1,
      y: 1,
    };
  }
  return {
    x: W / w,
    y: H / h,
  };
};

/**
 *
 * @param w width of SMALLEST view
 * @param h height of SMALLEST view
 * @param W width of BIGGEST view
 * @param H height of BIGGEST view
 * @returns
 */
export const downScale = (w: number, h: number, W: number, H: number) => {
  'worklet';
  if (!w || !h || !W || !H) {
    return {
      x: 1,
      y: 1,
    };
  }
  return {
    x: w / W,
    y: h / H,
  };
};

export const scale = <
  T extends { width: SharedValue<number>; height: SharedValue<number> }
>(
  small: T,
  big: T
) => {
  'worklet';
  if (
    !small.width.value ||
    !small.height.value ||
    !big.width.value ||
    !big.height.value
  ) {
    return {
      x: 1,
      y: 1,
    };
  }
  return {
    x: small.width.value / big.width.value,
    y: small.height.value / big.height.value,
  };
};
