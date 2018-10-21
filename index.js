import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Easing,
  TouchableOpacity,
  View
} from 'react-native';

const easing = Easing.out(Easing.circle);
const duration = 1500;
const useNativeDriver = true;

export const WithRipple = WrappedComponent => {
  class ComponentWithRipple extends Component {
    state = {
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rippleScale: new Animated.Value(0),
      opacity: new Animated.Value(0)
    };

    render() {
      const {
          rippleSize,
          divider,
          accent,
          secondary,
          onPress,
          wrapperStyle,
          hitSlop,
          ...rest
        } = this.props,
        { translateY, translateX, rippleScale, opacity } = this.state;

      return (
        <TouchableOpacity
          onPressIn={this._animateIn}
          onPressOut={this._animateOut}
          onPress={onPress}
          activeOpacity={1}
          style={[wrapperStyle, styles.wrapper]}
          hitSlop={hitSlop}
        >
          <WrappedComponent {...rest} pointerEvents='none' />
          <Animated.View
            style={[
              styles.ripple,
              this.getStyle(rippleSize, textColor),
              {
                opacity,
                transform: [
                  {
                    translateX
                  },
                  {
                    translateY
                  },
                  {
                    scale: rippleScale
                  }
                ]
              }
            ]}
            pointerEvents='none'
          />
        </TouchableOpacity>
      );
    }

    _animateIn = e => {
      const { rippleSize } = this.props,
        { translateY, translateX, rippleScale, opacity } = this.state;

      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: e.nativeEvent.locationY - rippleSize / 2,
            duration: 0,
            useNativeDriver
          }),
          Animated.timing(translateX, {
            toValue: e.nativeEvent.locationX - rippleSize / 2,
            duration: 0,
            useNativeDriver
          }),
          Animated.timing(rippleScale, {
            toValue: 0,
            duration: 0,
            useNativeDriver
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver
          })
        ]),
        Animated.parallel([
          Animated.timing(rippleScale, {
            toValue: 0.8,
            duration,
            easing,
            useNativeDriver
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration,
            easing,
            useNativeDriver
          })
        ]),
        Animated.parallel([
          Animated.timing(rippleScale, {
            toValue: 1,
            duration,
            easing,
            useNativeDriver
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration,
            easing,
            useNativeDriver
          })
        ])
      ]).start();
      
      this.props.onPressIn && this.props.onPressIn();
    };

    _animateOut = () => {
      const { opacity, rippleScale } = this.state;

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          easing,
          useNativeDriver
        }),
        Animated.timing(rippleScale, {
          toValue: 1,
          duration,
          easing,
          useNativeDriver
        })
      ]).start();

      this.props.onPressOut && this.props.onPressOut();
    };

    getStyle = (rippleSize, textColor) => ({
      width: rippleSize,
      height: rippleSize,
      borderRadius: rippleSize / 2,
      backgroundColor: textColor
    });
  }

  ComponentWithRipple.defaultProps = {
    rippleSize: 350
  };

  return ComponentWithRipple;
};

export default WithRipple(View);

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden'
  },
  ripple: {
    position: 'absolute'
  }
});
