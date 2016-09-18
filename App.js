// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  AsyncStorage,
  Dimensions,
  TextInput,
  Modal,
  Text,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Button,
  Tabs,
  Icon,
} from 'native-base';

import moment from 'moment';
import 'moment/locale/fi';

import ActionButton from 'react-native-action-button';

import Today from './src/Today';
import Week from './src/Week';
import Lunch from './src/Lunch';

import Theme from './Theme';
import { fetchLessons } from './api';
import { parseReservation } from './utils';


const TODAY_REF = 'TODAY';
const WEEK_REF = 'WEEK';
const LUNCH_REF = 'LUNCH';
const DB_PREFIX = 'LUKKARI-';
const STUDENT_GROUP_KEY = `${DB_PREFIX}STUDENT_GROUP`;
const REALIZATIONS_KEY = `${DB_PREFIX}REALIZATIONS`;

type Props = {
};

type State = {
  loading: boolean;
  fabVisible: boolean;
  studentGroup: ?string;
  realizations: ?Array<string>;
  storageChecked: boolean;
  weekLessons: Array<Lesson>;
  todayLessons: Array<Lesson>;
  modalVisible: boolean;
};

class App extends Component<*, Props, State> {
  props: Props;
  onTabChange: Function;
  getPreferences: Function;
  getLessons: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      storageChecked: false,
      fabVisible: true,
      weekLessons: [],
      todayLessons: [],
      studentGroup: null,
      realizations: null,
      modalVisible: false,
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.getPreferences = this.getPreferences.bind(this);
    this.getLessons = this.getLessons.bind(this);
  }

  state: State;

  componentWillMount() {
    this.getPreferences();
  }

  // eslint-disable-next-line sort-class-members/sort-class-members, arrow-parens
  getLessons = async(type: TimeType) => {
    this.setState({ loading: true });
    if (!this.state.studentGroup) {
      return;
    }
    try {
      const data = await fetchLessons({ studentGroup: [this.state.studentGroup], type });
      if (!data.reservations || data.reservations.length === 0) {
        this.setState({ loading: false });
        return;
      }
      const lessons: Array<Lesson> = data.reservations
        .map(reservation => parseReservation(reservation))
        .sort((a, b) => moment(a.startDate).isBefore(b.startDate));

      if (type === 'week') {
        this.setState({
          weekLessons: lessons,
        });
      } else if (type === 'today') {
        this.setState({
          todayLessons: lessons,
        });
      }
      this.setState({ loading: false });
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line sort-class-members/sort-class-members, arrow-parens
  getPreferences = async() => {
    try {
      const keys: Array<string> = [STUDENT_GROUP_KEY, REALIZATIONS_KEY];
      const stores = await AsyncStorage.multiGet(keys);
      let gotData = false;
      stores.map((result, i, store) => {
        const key = store[i][0];
        const value = store[i][1];
        if (key === STUDENT_GROUP_KEY) {
          if (value !== null) {
            this.setState({
              studentGroup: value,
            });
            gotData = true;
          }
        } else if (key === REALIZATIONS_KEY) {
          if (value !== null) {
            this.setState({
              realizations: value,
            });
            gotData = true;
          }
        }
        return null;
      });
      this.setState({ storageChecked: true });
      if (gotData) {
        this.getLessons('week');
        this.getLessons('today');
      } else {
        this.setState({
          modalVisible: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    const fabVisible: boolean = this.state.fabVisible;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#303F9F"
          barStyle="default"
        />
        <Container theme={Theme}>
          <Header>
            <Title>TAMK lukkari{this.state.studentGroup ? ' - ' : ''}{this.state.studentGroup}</Title>
          </Header>
          <View style={{ flex: 0, flexDirection: 'column' }}>
            <Tabs
              onChangeTab={this.onTabChange}
              tabBarActiveTextColor="#000"
            >
              <Today ref={TODAY_REF} tabLabel="Tänään" lessons={this.state.todayLessons} />
              <Week ref={WEEK_REF} tabLabel="Viikko" lessons={this.state.weekLessons} />
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
              onPress={() => this.setState({ modalVisible: true })}
            >
              <Icon name="md-swap" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View style={styles.modal}>
            <View style={styles.modalInner}>
              <Text>Ryhmä</Text>
              <TextInput
                placeholder="14TIKOOT"
                text={this.state.studentGroup}
                onChangeText={text => this.setState({ studentGroup: text })}
              />
              <Button
                onPress={() => {
                  this.setState({ modalVisible: false });
                  this.getLessons('today');
                  this.getLessons('week');
                  AsyncStorage.setItem(STUDENT_GROUP_KEY, this.state.studentGroup);
                }}
              >
                <Text>Vaihda</Text>
                <Icon name="md-send" />
              </Button>
            </View>
          </View>
        </Modal>
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
  modal: {
    flex: 0,
    position: 'absolute',
    width: 200,
    height: 200,
    elevation: 2,
    left: Dimensions.get('window').width / 2 - 100,
    top: Dimensions.get('window').height / 2 - 100,
  },
  modalInner: {
    backgroundColor: '#fff',
    padding: 6,
    justifyContent: 'center',
    flex: 1,
  },
});

export default App;
