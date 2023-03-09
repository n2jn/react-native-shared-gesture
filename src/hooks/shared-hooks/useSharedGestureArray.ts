import { useSharedValue } from 'react-native-reanimated';
import type { SharedGesturesArray } from '../../type';

export const useSharedGestureArray = (
  numObject: number
): SharedGesturesArray => {
  return [...Array(numObject)].map((_, i) => ({
    id: i,
    isGestureBeingUsed: useSharedValue(false),
    isGestureEnabled: useSharedValue(true),
    translation: {
      x: useSharedValue(0),
      y: useSharedValue(0),
    },
  }));
};
