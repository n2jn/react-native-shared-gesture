import type { SharedValue } from 'react-native-reanimated';

export type SharedGestureObject = {
  isGestureBeingUsed: SharedValue<boolean>;
  isGestureEnabled: SharedValue<boolean>;
  id: number;
  translation: { x: SharedValue<number>; y: SharedValue<number> };
};

export type SharedGesturesArray = Array<SharedGestureObject>;

export type SharedRefType = {
  setTranslation: (x: number, y: number) => void;
  getGestureType: () => 'StickyPan' | 'onScroll';
  showContent: () => void;
};
