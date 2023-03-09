import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSharedViewRef } from '../../hooks/shared-hooks/useSharedVewRef';
import type { SharedGestureObject, SharedRefType } from '../../type';

type SliderProps = ViewProps & {
  children: React.ReactNode;
  sharedGesture: SharedGestureObject;
};

const Slider = (
  { children, sharedGesture: sg, ...viewProps }: SliderProps,
  ref: React.ForwardedRef<SharedRefType>
) => {
  const viewRef = useSharedViewRef<View>(ref, {
    setTranslation: (x: number, y: number) => {
      'worklet';
      sg.translation.x.value = x;
      sg.translation.y.value = y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const { translation } = sg;
    return {
      transform: [
        { translateX: withSpring(translation.x.value) },
        { translateY: withSpring(translation.y.value) },
      ],
    };
  }, [sg]);

  return (
    <View ref={viewRef} {...viewProps}>
      <Animated.View style={[styles.cursor, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cursor: {
    width: 50,
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
  },
});

export default React.forwardRef(Slider);
