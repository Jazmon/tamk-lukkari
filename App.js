// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ListView,
  Text,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  List,
  ListItem,
  Text as NBText,
  Tabs,
  Spinner,
  Icon,
  Button,
} from 'native-base';
import moment from 'moment';
import ActionButton from 'react-native-action-button';

import Today from './src/Today';
import Week from './src/Week';

import Theme from './Theme';

const TODAY_REF = 'TODAY';
const WEEK_REF = 'WEEK';

type Props = {
};

type State = {
  // lessons: Array<Lesson>;
  loading: boolean;
};

class App extends Component<*, Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      // lessons: [],
      loading: true,
    };
  }

  state: State;

  render(): React.Element<*> {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#303F9F"
          barStyle="default"
        />
        <Container theme={Theme}>
          <Header>
            {/* <Button transparent>
              <Icon name="md-menu" />
            </Button> */}
            <Title>TAMK lukkari</Title>
          </Header>
          <Content>
            <Tabs
              onChangeTab={(val) => console.log(val.i, val.ref.ref)}
              // tabBarPosition="overlayTop"
              // style={{ marginTop: 56 }}
              // tabBarUnderlineStyle={{ height: 4,}}
              tabBarActiveTextColor="#000"
            >
              <Today ref={TODAY_REF} tabLabel="Tänään" />
              <Week ref={WEEK_REF} tabLabel="Viikko" />
            </Tabs>
          </Content>
        </Container>
        <ActionButton
          buttonColor="rgba(255, 62, 128, 1)"
          bgColor="rgba(238, 238, 238, 0.59)"
          offsetX={16}
          offsetY={0}
          style={styles.fab}
        >
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Lisää kurssi"
            onPress={() => console.log("notes tapped!")}
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
      </View>
    );
  }
}
const styles = StyleSheet.create({
  fab: {
    // position: 'absolute',
    // right: 0,
    // bottom: 0,
    // margin: 0,
    // padding: 0,
    // borderColor: '#f00', borderWidth: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

export default App;
