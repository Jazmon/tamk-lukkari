// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  AsyncStorage,
  Dimensions,
  TextInput,
  BackAndroid,
  Modal,
  Text,
} from 'react-native';
// import {
//   Container,
//   Header,
//   Title,
//   Button,
//   Tabs,
//   Icon,
// } from 'native-base';

import Icon, { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import moment from 'moment';
import 'moment/locale/fi';

import ActionButton from 'react-native-action-button';

import Today from './src/Today';
import Week from './src/Week';
import Lunch from './src/Lunch';

// import Theme from './Theme';
import { fetchLessons } from './api';
import { parseReservation } from './utils';
import Button from './src/Button';


const TODAY_REF = 'TODAY';
const WEEK_REF = 'WEEK';
// const LUNCH_REF = 'LUNCH';
const DB_PREFIX = 'LUKKARI-';
const STUDENT_GROUP_KEY = `${DB_PREFIX}STUDENT_GROUP`;
const REALIZATIONS_KEY = `${DB_PREFIX}REALIZATIONS`;

type Props = {
};

type State = {
  loading: boolean;
  showReload: boolean;
  studentGroup: ?string;
  realizations: ?Array<string>;
  storageChecked: boolean;
  weekLessons: Array<Lesson>;
  todayLessons: Array<Lesson>;
  modalVisible: boolean;
  realizationText: ?string;
  addRealizationModalVisible: boolean;
};

class App extends Component<*, Props, State> {
  props: Props;
  backListener: Object;
  lunch: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      storageChecked: false,
      showReload: false,
      weekLessons: [],
      todayLessons: [],
      studentGroup: null,
      realizations: null,
      modalVisible: false,
      realizationText: null,
      addRealizationModalVisible: false,
    };
  }

  state: State;

  componentWillMount() {
    this.backListener = BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.state.modalVisible) {
        this.setState({
          modalVisible: false,
        });
        return true;
      } else if (this.state.addRealizationModalVisible) {
        this.setState({
          addRealizationModalVisible: false,
        });
        return true;
      }
      return false;
    });
    this.getPreferences();
  }

  componentWillUnmount() {
    this.backListener.remove();
  }

  // eslint-disable-next-line arrow-parens
  getLessons = async(type: TimeType) => {
    console.log('getLessons');
    this.setState({ loading: true });
    if (!this.state.studentGroup) {
      return;
    }
    try {
      const data = await fetchLessons({ studentGroup: [this.state.studentGroup], type });
      if (!data.reservations || data.reservations.length === 0) {
        this.setState({ loading: false });
        console.log('no reservations');
        return;
      }
      const lessons: Array<Lesson> = data.reservations
        .map(reservation => parseReservation(reservation))
        .sort((a, b) => moment(a.startDate).isBefore(b.startDate));

      if (type === 'week') {
        console.log('got weeklessons', lessons);
        this.setState({
          weekLessons: lessons,
        });
      } else if (type === 'day') {
        console.log('got todaylessons', lessons);
        this.setState({
          todayLessons: lessons,
        });
      }
      this.setState({ loading: false });
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line arrow-parens
  getRealizationLessons = async(realization: string | Array<string>) => {
    console.log('getRealizationLessons');
    this.setState({ loading: true });
    // if (!this.state.studentGroup) {
    //   return;
    // }
    try {
      const data = await fetchLessons({ realization, type: 'week' });
      if (!data.reservations || data.reservations.length === 0) {
        this.setState({ loading: false });
        console.log('no reservations');
        return;
      }
      // get all lessons
      const lessons: Array<Lesson> = data.reservations
        .map(reservation => parseReservation(reservation))
        .sort((a, b) => moment(b.startDate).isBefore(a.startDate));
      console.log('realization lessons', lessons);

      const weekLessons: Array<Lesson> = [...lessons, ...this.state.weekLessons]
        .sort((a, b) => moment(a.startDate).isBefore(b.startDate));
      const todayLessons: Array<Lesson> = weekLessons
        .filter(lesson => moment(lesson.startDate).isSame(new Date(), 'day'));
      console.log('weeklessons', weekLessons);
      console.log('todayLessons', todayLessons);
      this.setState({
        weekLessons,
        todayLessons,
      });
      this.setState({ loading: false });
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line arrow-parens
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
              realizations: JSON.parse(value),
            });
            gotData = true;
          }
        }
        return null;
      });
      this.setState({ storageChecked: true });
      if (gotData) {
        this.getLessons('week');
        this.getLessons('day');
        if (this.state.realizations) {
          this.getRealizationLessons(this.state.realizations);
          // this.state.realizations.forEach((realization) => {
          //   this.getRealizationLessons(realization);
          // });
        }
      } else {
        this.setState({
          modalVisible: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line arrow-parens
  onRefresh = async(caller: TimeType, cb: Function) => {
    await this.getLessons(caller);
    cb();
  };

  onTabChange = (value: Object) => {
    if (value.i === 2) {
      // this.setState({
      //   fabVisible: false,
      // });
      this.setState({
        showReload: true,
      });
    } else if (this.state.showReload) {
      this.setState({
        showReload: false,
      });
    }
  };

  toolbarActionSelected = (position: number) => {
    console.log('position', position);
  };

  reloadWebview = () => {
    this.lunch.reload();
  }

  renderFab = (showReload: boolean) => {
    if (showReload) {
      return (
        <ActionButton
          buttonColor="rgba(255, 62, 128, 1)"
          // bgColor="rgba(238, 238, 238, 0.59)"
          offsetX={16}
          offsetY={0}
          text="Reload"
          onPress={this.reloadWebview}
          icon={<Icon name="refresh" style={styles.actionButtonIcon} />}
        />
      );
    }
    return (
      <ActionButton
        buttonColor="rgba(255, 62, 128, 1)"
        bgColor="rgba(238, 238, 238, 0.59)"
        offsetX={16}
        offsetY={0}
      >
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Lisää kurssi"
          onPress={() => this.setState({ addRealizationModalVisible: true })}
        >
          <Icon name="add" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="Vaihda ryhmää"
          onPress={() => this.setState({ modalVisible: true })}
        >
          <Icon name="swap-horiz" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  }

  renderModal = () => (
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
            placeholderTextColor="rgba(0, 0, 0, 0.38)"
            autoCorrect={false}
            underlineColorAndroid="rgba(255, 62, 128, 1)"
            returnKeyType="done"
            autoCapitalize="characters"
            text={this.state.studentGroup}
            onChangeText={text => this.setState({ studentGroup: text.toUppercase() })}
          />
          <Button
            backgroundColor="#EEE"
            rippleColor="#000"
            onPress={() => {
              this.setState({ modalVisible: false });
              this.getLessons('day');
              this.getLessons('week');
              AsyncStorage.setItem(STUDENT_GROUP_KEY, this.state.studentGroup);
            }}
          >
            <Text>Vaihda</Text>
            <Icon name="send" />
          </Button>
        </View>
      </View>
    </Modal>
  );

  renderRealizationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.addRealizationModalVisible}
      onRequestClose={() => {}}
    >
      <View style={styles.modal}>
        <View style={styles.modalInner}>
          <Text>Kurssin tunnus</Text>
          <TextInput
            placeholder="4-AOT14-3003"
            text={this.state.realizationText}
            autoCapitalize="characters"
            placeholderTextColor="rgba(0, 0, 0, 0.38)"
            autoCorrect={false}
            underlineColorAndroid="rgba(255, 62, 128, 1)"
            returnKeyType="done"
            onChangeText={text => this.setState({ realizationText: text.toUppercase() })}
          />
          <Button
            backgroundColor="#EEE"
            rippleColor="#000"
            onPress={() => {
              if (!this.state.realizationText) {
                return;
              }
              const realizations = this.state.realizations
                ? [...this.state.realizations, this.state.realizationText]
                : [this.state.realizationText];
              this.getRealizationLessons(this.state.realizationText);

              this.setState({
                addRealizationModalVisible: false,
                realizationText: null,
                realizations,
              });
              AsyncStorage.setItem(REALIZATIONS_KEY, JSON.stringify(realizations));
            }}
          >
            <Text>Lisää</Text>
            <Icon name="add" />
          </Button>
        </View>
      </View>
    </Modal>
  );

  render(): React.Element<*> {
    const showReload: boolean = this.state.showReload;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#303F9F"
          barStyle="default"
        />
        <View style={styles.innerContainer}>
          <ToolbarAndroid
            title="TAMK lukkari"
            titleColor="#fff"
            subtitleColor="rgba(255, 255, 255, 0.87)"
            subtitle={this.state.studentGroup ? this.state.studentGroup : ''}
            style={styles.toolbar}
            contentInsetStart={32}
            contentInsetEnd={24}
            onActionSelected={this.toolbarActionSelected}
            overflowIconName="more"
            actions={[{
              title: 'Share',
              iconName: 'share',
              show: 'always',
              showWithText: false,
            }, {
              title: 'Settings',
              iconName: 'settings',
              show: 'always',
              showWithText: false,
            }]}
          />
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <ScrollableTabView
              onChangeTab={this.onTabChange}
              tabBarActiveTextColor="#fff"
              tabBarBackgroundColor="#5C6BC0"
              tabBarInactiveTextColor="rgba(255, 255, 255, 0.87)"
              tabBarUnderlineStyle={styles.tabUnderline}
              tabBarTextStyle={styles.tabText}
              style={styles.tabsContainer}
              prerenderingSiblingsNumber={2}
            >
              <Today
                ref={TODAY_REF}
                tabLabel="Tänään"
                lessons={this.state.todayLessons}
                onRefresh={this.onRefresh}
              />
              <Week
                ref={WEEK_REF}
                tabLabel="Viikko"
                lessons={this.state.weekLessons}
                onRefresh={this.onRefresh}
              />
              <Lunch
                // eslint-disable-next-line no-return-assign
                ref={(c) => this.lunch = c}
                tabLabel="Lounaslista"
              />
            </ScrollableTabView>
            {this.renderFab(showReload)}
          </View>
        </View>
        {this.renderModal()}
        {this.renderRealizationModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#3F51B5',
  },
  tabsContainer: {
  },
  tabUnderline: {
    backgroundColor: 'rgba(255, 62, 128, 1)',
  },
  tabText: {
    fontSize: 16,
  },
  // toolbarTitle: {
  //   fontSize: 20,
  //   color: '#fff',
  // },
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
