import { Ref, useImperativeHandle } from 'react';
import Animated, { scrollTo, useAnimatedRef } from 'react-native-reanimated';
import type { SharedRefType } from '../../type';

type AcceptedListRefType = Animated.FlatList<any> | Animated.ScrollView;

export const useSharedListRef = <ListRefType extends AcceptedListRefType>(
  ref: Ref<SharedRefType>,
  customRefFunctions: Partial<SharedRefType>
) => {
  const listRef = useAnimatedRef<ListRefType>();

  useImperativeHandle(
    ref,
    () => ({
      setTranslation: (x: number, y: number) => {
        'worklet';
        scrollTo(listRef, x, y, true);
      },
      getGestureType: () => 'onScroll',
      showContent: () => {
        /** Default showContent */
      },
      ...customRefFunctions,
    }),
    [listRef]
  );

  return listRef;
};
