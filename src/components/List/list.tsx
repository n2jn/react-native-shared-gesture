import React, { useCallback } from 'react';
import { FlatListProps, LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import type { DimensionObject } from '../../hooks/dimension-hooks/type';
import type { SharedGestureObject, SharedRefType } from '../../type';
import { useSharedListRef } from '../../hooks/shared-hooks/useSharedListRef';
import useFlexibleLayout from './useFlexibleLayout';

// https://fettblog.eu/typescript-react-generic-forward-refs/

type ListProps<T extends Record<string, unknown>> = FlatListProps<T> & {
  itemSize: DimensionObject;
  sharedGesture: SharedGestureObject;
};

function List<T extends Record<string, unknown>>(
  {
    itemSize,
    numColumns: defaultNumColumns,
    style,
    sharedGesture: sg,
    ...flatlistProps
  }: ListProps<T>,
  ref: React.ForwardedRef<SharedRefType>
) {
  const flatlistRef = useSharedListRef<Animated.FlatList<T>>(ref, {});
  const { numColumns, key, ...flexibleLayout } = useFlexibleLayout({
    numberOfItems: flatlistProps.data?.length || 0,
    itemSize,
    defaultNumColumns,
  });

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    flexibleLayout.onLayout(e);
    flatlistProps.onLayout?.(e);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      sg.translation.y.value = event.contentOffset.y;
      sg.translation.x.value = event.contentOffset.x;
    },
    onBeginDrag: (_) => {
      sg.isGestureBeingUsed.value = true;
    },
    onEndDrag: (_) => {
      sg.isGestureBeingUsed.value = false;
    },
    onMomentumBegin: (_) => {
      sg.isGestureBeingUsed.value = true;
    },
    onMomentumEnd: (_) => {
      sg.isGestureBeingUsed.value = false;
    },
  });

  const keyExtractor = useCallback(
    (item: T, index: number) => `${item.idDrink}${index}`,
    []
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemSize.width,
      offset: itemSize.height * index,
      index,
    }),
    [itemSize]
  );

  return (
    <Animated.FlatList
      {...flatlistProps}
      key={key}
      numColumns={numColumns}
      onLayout={onLayout}
      style={[style, styles.scrollContainer]}
      ref={flatlistRef}
      onScroll={scrollHandler}
      getItemLayout={getItemLayout}
      keyExtractor={keyExtractor}
    />
  );
}

export default React.forwardRef(List);

const styles = StyleSheet.create({
  scrollContainer: {
    flexWrap: 'wrap',
  },
});
