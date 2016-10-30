// @flow
import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

type Props = {
  navigator: Object;
  route: Object;
  relay: Object;
  loading: boolean;
};

type State = {
  text: string;
};

// type DefaultProps = {};

class Settings extends Component<*, Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      text: 'Settings',
    };
  }

  state: State;

  render(): React.Element<*> {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Settings</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
    fontSize: 16,
  },
});

export default Settings;
