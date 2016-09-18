// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  ListView,
  WebView,
  Text,
  Dimensions,
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
const LUNCH_REF = 'LUNCH';

type Props = {
};

type State = {
  // lessons: Array<Lesson>;
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
            {/* <Button transparent>
              <Icon name="md-menu" />
            </Button> */}
            <Title>TAMK lukkari</Title>
          </Header>
          <View style={{ flex: 0, flexDirection: 'column' }}>
            <Tabs
              onChangeTab={this.onTabChange}
              // tabBarPosition="overlayTop"
              // style={{ marginTop: 56 }}
              // tabBarUnderlineStyle={{ height: 4,}}
              tabBarActiveTextColor="#000"
            >
              <Today ref={TODAY_REF} tabLabel="Tänään" />
              <Week ref={WEEK_REF} tabLabel="Viikko" />
              <WebView
                tabLabel="Lounaslista"
                ref={LUNCH_REF}
                source={{ uri: 'http://www.campusravita.fi/ruokalista' }}
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={true}
                startInLoadingState={true}
                renderLoading={() =>
                  <View style={{ flex: 1 }}>
                    <Spinner color="rgb(224, 36, 93)" />
                  </View>
                }
                javaScriptEnabled={true}
                injectedJavaScript={
                  `(function hideElements() {
                    var asides = document.getElementsByTagName('aside');
                    Array.prototype.forEach.call(asides, function(aside) {
                      aside.innerHTML = '';
                    });
                    var header = document.getElementsByClassName('container header')[0];
                    header.innerHTML = '';
                    header.style.padding = 0;
                    document.getElementsByClassName('navbar-header')[0].innerHTML = '';
                    document.getElementById('navbar').style.minHeight = 0;
                    var css = '.main-container > .row { padding: 30px 0 40px 0; }';
                    var head = document.head || document.getElementsByTagName('head')[0];
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    if (style.styleSheet) {
                      style.styleSheet.cssText = css;
                    } else {
                      style.appendChild(document.createTextNode(css));
                    }
                    head.appendChild(style);
                  }());`
                }
              />
            </Tabs>
          </View>
        </Container>
        {fabVisible &&
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
