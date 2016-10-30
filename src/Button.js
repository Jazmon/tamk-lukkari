// @flow
import React from 'react';
import {
  View,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

const defaultProps = {
  text: '',
};

const Touchable = Platform.OS === 'ios' ? TouchableHighlight : TouchableNativeFeedback;

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
    <Touchable
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      // eslint-disable-next-line new-cap
      background={Platform.OS === 'android' ? TouchableNativeFeedback.Ripple(props.rippleColor) : undefined}
    >
      <View style={[styles.container, props.style, { backgroundColor: props.backgroundColor }]}>
        {props.children}
      </View>
    </Touchable>

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
