// @flow
import React from 'react';
import {
  View,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';

const defaultProps = {
  text: '',
};

type Props = {
  style?: ?number;
  backgroundColor: string;
  children?: React.Element<*> | Array<React.Element<*>>;
  rippleColor: string;
  onPress?: ?Function;
  onLongPress?: ?Function;
};

function Button(props: Props): React.Element<*> {
  return (
    <TouchableNativeFeedback
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      // eslint-disable-next-line new-cap
      background={TouchableNativeFeedback.Ripple(props.rippleColor)}
    >
      <View style={[styles.container, props.style, { backgroundColor: props.backgroundColor }]}>
        {props.children}
      </View>
    </TouchableNativeFeedback>

  );
}

Button.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // innerContainer: {
  //
  // },
});

export default Button;
