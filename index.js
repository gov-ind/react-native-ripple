import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Easing,
  TouchableOpacity,
  View
} from 'react-native';
import PropTypes from 'prop-types';

const easing = Easing.out(Easing.circle);
const duration = 1500;
const useNativeDriver = true;

export const WithRipple = Wrapped =>
  /* eslint-disable max-len */
  /**
   *
   * @augments {Component<{size: number, color: string, onPress: Function, wrapperStyle: number, hitSlop: Object}>}
   *
   */
  class extends Component {
    static propTypes = {
      size: PropTypes.number,
      color: PropTypes.string,
      onPress: PropTypes.func,
      wrapperStyle: PropTypes.any,
      hitSlop: PropTypes.object
    };

    static defaultProps = {
      size: 350
    };

    state = {
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rippleScale: new Animated.Value(0),
      opacity: new Animated.Value(0)
    };

    render() {
      const {
        size,
        color = '#414141',
        onPress,
        wrapperStyle,
        hitSlop,
        ...rest
      } = this.props;
      const { translateY, translateX, rippleScale, opacity } = this.state;

      return (
        <TouchableOpacity
          onPressIn={this._animateIn}
          onPressOut={this._animateOut}
          onPress={onPress}
          activeOpacity={1}
          style={wrapperStyle}
          hitSlop={hitSlop}
        >
          <Wrapped {...rest} pointerEvents='none' />
          <Animated.View
            style={[
              styles.ripple,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: color,
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
      const { size } = this.props,
        { translateY, translateX, rippleScale, opacity } = this.state;

      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: e.nativeEvent.locationY - size / 2,
            duration: 0,
            useNativeDriver
          }),
          Animated.timing(translateX, {
            toValue: e.nativeEvent.locationX - size / 2,
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
  };

export default WithRipple(View);

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute'
  }
});
