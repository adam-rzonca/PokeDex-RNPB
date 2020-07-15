import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';

export const AnimatedBar = ({value, index}) => {
  const width = useRef(new Animated.Value(0)).current;

  const animate = () => {
    Animated.timing(width, {
      toValue: value,
      delay: index * 150,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animate();
  }, [value]);

  const interpolatedValue = width.interpolate({
    inputRange: [0, 255],
    outputRange: [0, 100],
  });

  return <Animated.View style={[styles.bar, {width: interpolatedValue}]} />;
};

const styles = {
  bar: {backgroundColor: '#516AAC', height: 8},
};
