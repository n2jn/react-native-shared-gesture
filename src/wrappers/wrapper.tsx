import React, {useCallback, useMemo, useRef} from 'react';
import type {LayoutChangeEvent} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {useDerivedValue} from 'react-native-reanimated';
import {scale} from '../helper';
import useAnimatedDimension from '../hooks/dimension-hooks/useAnimatedDimension';
import type {SharedRefType} from '../type';
import {useSharedGestureArray} from '../hooks/shared-hooks/useSharedGestureArray';

const Pan = Gesture.Pan().onChange(e => console.log(e));

type GestureHandlerProps = {
  node: React.ReactNode;
  key: number;
};

const GestureHandler = ({node}: GestureHandlerProps) => {
  return <GestureDetector gesture={Gesture.Race(Pan)}>{node}</GestureDetector>;
};

// renamenn
export const Wrapper = ({children}: {children: React.ReactNode[]}) => {
  const childRefs = new Array(children.length)
    .fill(0)
    .map(() => useRef<SharedRefType | null>(null));

  const layoutSizes = new Array(children.length)
    .fill(0)
    .map(() => useAnimatedDimension());

  const contentSizes = new Array(children.length)
    .fill(0)
    .map(() => useAnimatedDimension());

  useDerivedValue(() => {
    console.log('contentSize', {contentSizes});
  }, [contentSizes]);

  const sharedGestureArray = useSharedGestureArray(children.length);

  const indexedBySize = new Array(children.length)
    .fill(0)
    .map((_, index) => index);

  useDerivedValue(() => {
    sharedGestureArray.forEach((sg, sIndex) => {
      //  console.log('sharedGestureArray', sharedGestureArray);
      if (sg.isGestureBeingUsed.value) {
        const scaleIndex = indexedBySize?.findIndex(v => v === sIndex);
        console.log('scaleIndex', scaleIndex);

        childRefs.forEach((ref, cIndex) => {
          if (cIndex < scaleIndex) {
            if (cIndex < scaleIndex) {
              const s = scale(contentSizes[sIndex]!, layoutSizes[cIndex]!);
              ref.current?.setTranslation(
                sg.translation.x.value * s.x,
                sg.translation.y.value * s.y,
              );
            }
          } else if (cIndex > scaleIndex) {
            const s = scale(layoutSizes[cIndex]!, contentSizes[sIndex]!);
            ref.current?.setTranslation(
              sg.translation.x.value * s.x,
              sg.translation.y.value * s.y,
            );
          }
        });
      }
    });
  }, [sharedGestureArray, indexedBySize]);

  useDerivedValue(() => {
    indexedBySize.sort(
      (a, b) => layoutSizes[b]!.height.value - layoutSizes[a]!.height.value,
    );
  }, [layoutSizes]);

  const onLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const {height: h, width: w} = e.nativeEvent.layout;
      const lHeight = parseInt(h.toFixed(0));
      const lWidth = parseInt(w.toFixed(0));

      // will never be undefined, based on the length of the children
      layoutSizes[index]!.height.value = lHeight;
      layoutSizes[index]!.width.value = lWidth;
      // make a list of the biggest to the lowest sizes
    },
    [],
  );

  const onContentSizeChange = useCallback(
    (index: number) => (w: number, h: number) => {
      const cHeight = parseInt(h.toFixed(0));
      const cWidth = parseInt(w.toFixed(0));

      contentSizes[index]!.height.value = cHeight;
      contentSizes[index]!.width.value = cWidth;
    },
    [],
  );

  const getRef = useCallback(
    (index: number) => (n: SharedRefType) => {
       childRefs[index]!.current = n;
    },
    [],
  );

  const SharedChildren = useMemo(
    () =>
      React.Children.map(children, (child, index) =>
        React.cloneElement(
          child as React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
          >,
          {
            ref: getRef(index),
            onLayout: onLayout(index),
            onContentSizeChange: onContentSizeChange(index),
            sharedGesture: sharedGestureArray[index],
          },
        ),
      ),
    [children],
  );

  return (
    <>
      {SharedChildren?.map((child, index) => (
        <GestureHandler key={index} node={child} />
      )) ?? SharedChildren}
    </>
  );
};
