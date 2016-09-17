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

class App extends Component<*, Props, State> {
  props: Props;

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
  };


  constructor(props: Props) {
    super(props);

    this.state = {
      text: 'App',
    };
  }

  state: State;

  render(): React.Element<*> {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>App</Text>
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

export default App;
