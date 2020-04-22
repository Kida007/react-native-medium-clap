import React from "react";
import {
  Animated,
  Easing,
  View,
  TouchableWithoutFeedback,
  Text,
  Platform,
} from "react-native";
import PropTypes from "prop-types";

import Clap from "./assets/Clap";

import styles from "./styles";

class MediumClap extends React.Component {
  state = { clap: 0 };
  animationControl = new Animated.Value(0);
  animationControl2 = new Animated.Value(0);
  top = false;

  removeAnimation = (clap) => {
    Animated.timing(this.animationControl, {
      toValue: 2,
      duration: 300,
      easing: Easing.ease,
    }).start(() => {
      this.animationControl.setValue(0);
      this.top = false;
    });
  };

  getCircleStyles = (radius) => ({
    borderRadius: radius,
    width: radius * 2,
    height: radius * 2,
  });

  animate = () => {
    if (this.state.clap < 50) {
      this.props.onClapIncrease();
      this.setState({ clap: this.state.clap + 1 });
    }
    if (this.top) {
      this.animationControl2.setValue(0);
      Animated.timing(this.animationControl2, {
        toValue: 1,
        duration: 200,
        easing: Easing.in,
      }).start();
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.removeAnimation, 2000);
      return;
    }
    Animated.timing(this.animationControl, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
    }).start(() => {
      this.top = true;
    });
    this.timeout = setTimeout(this.removeAnimation, 2000);
  };

  render() {
    const { color, clapSize, countRadius, countTextStyle } = this.props;

    const translateY = this.animationControl.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [
        0,
        -1 * this.props.translateY,
        -1 * (this.props.translateY + 10),
      ],
    });

    const opacity = this.animationControl.interpolate({
      inputRange: [0, 0.2, 1, 2],
      outputRange: [0, 1, 1, 0],
    });

    const scale = this.animationControl2.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.1, 1],
    });

    const containerStyle = {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
    };

    return (
      <View style={{ alignSelf: "flex-start" }}>
        <View style={containerStyle}>
          <Animated.View
            style={[
              styles.circle,
              {
                opacity,
                transform: [{ scale }, { translateY }],
                backgroundColor: color,
              },
              this.getCircleStyles(countRadius),
            ]}
          >
            <Text style={[styles.countText, countTextStyle]}>
              {"+" + this.state.clap}
            </Text>
          </Animated.View>
        </View>
        <View style={styles.clapContainer}>
          <TouchableWithoutFeedback onPress={this.animate}>
            <Clap color={color} size={clapSize} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

MediumClap.propTypes = {
  onClapIncrease: PropTypes.func,
  color: PropTypes.string,
  translateY: PropTypes.number,
  countRadius: PropTypes.number,
  countTextStyle: PropTypes.object,
  clapSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MediumClap.defaultProps = {
  color: "#07AF6A",
  clapSize: 45,
  translateY: Platform.OS === "web" ? 20 : 40,
  countRadius: 20,
  countTextStyles: {},
  onClapIncrease: () => {},
};

export default MediumClap;
