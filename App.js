// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Tabs,
  Spinner,
  Icon,
} from 'native-base';
import ActionButton from 'react-native-action-button';

import Today from './src/Today';
import Week from './src/Week';
import Lunch from './src/Lunch';

import Theme from './Theme';

const TODAY_REF = 'TODAY';
const WEEK_REF = 'WEEK';
const LUNCH_REF = 'LUNCH';

type Props = {
};

type State = {
  loading: boolean;
  fabVisible: boolean;
};

class App extends Component<*, Props, State> {
  props: Props;
  onTabChange: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      // lessons: [],
      loading: true,
      fabVisible: true,
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  state: State;

  onTabChange(value: Object) {
    if (value.ref.ref === LUNCH_REF) {
      this.setState({
        fabVisible: false,
      });
    } else if (!this.state.fabVisible) {
      this.setState({
        fabVisible: true,
      });
    }
  }

  render(): React.Element<*> {
    const fabVisible = this.state.fabVisible;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#303F9F"
          barStyle="default"
        />
        <Container theme={Theme}>
          <Header>
            <Title>TAMK lukkari</Title>
          </Header>
          <View style={{ flex: 0, flexDirection: 'column' }}>
            <Tabs
              onChangeTab={this.onTabChange}
              tabBarActiveTextColor="#000"
            >
              <Today ref={TODAY_REF} tabLabel="Tänään" />
              <Week ref={WEEK_REF} tabLabel="Viikko" />
              <Lunch ref={LUNCH_REF} tabLabel="Lounaslista" />
            </Tabs>
          </View>
        </Container>
        {fabVisible &&
          <ActionButton
            buttonColor="rgba(255, 62, 128, 1)"
            bgColor="rgba(238, 238, 238, 0.59)"
            offsetX={16}
            offsetY={0}
          >
            <ActionButton.Item
              buttonColor="#9b59b6"
              title="Lisää kurssi"
              onPress={() => {}}
            >
              <Icon name="md-add" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#1abc9c"
              title="Vaihda ryhmää"
              onPress={() => {}}
            >
              <Icon name="md-swap" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default App;
