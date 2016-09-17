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

import 'moment/locale/fi';

import Theme from './Theme';
import { fetchLessons } from './api';

type Resource = {
  id: number;
  type: 'realization' | 'student_group' | 'scheduling_group' | 'room' | 'building';
  code: string;
  name: string;
  parent?: Resource;
};

type Reservation = {
  id: number;
  modifiedDate: string;
  subject: string;
  description: string;
  startDate: string;
  endDate: string;
  resources: Array<Resource>;
};

type Lesson = {
  id: number;
  startDate: string;
  endDate: string;
  course: {
    id: string;
    name: string;
  };
  studentGroups: Array<string>;
  // teacher: string;
  room: string;
};

function parseReservation(reservation: Reservation): Lesson {
  const roomResource: ?Object = reservation.resources.find(res => res.type === 'room');
  const realizationResource: ?Object = reservation.resources.find(res => res.type === 'realization');
  const lesson: Lesson = {
    id: reservation.id,
    course: {
      name: realizationResource ? realizationResource.name : '',
      id: realizationResource ? realizationResource.code : '',
    },
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    room: roomResource ? roomResource.code : '',
    studentGroups: reservation.resources
      .filter(res => res.type === 'student_group')
      .map(res => res.code),
  };
  return lesson;
}

function lessonsToMap(lessons: Array<Lesson>): Object {
  const map = {};
  lessons.map((lesson) => {
    const key = moment(lesson.startDate).format('dddd, D.M.');
    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(lesson);
    return null;
  });
  return map;
}

type Props = {
};

type State = {
  // lessons: Array<Lesson>;
  loading: boolean;
};

const DataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

const TodayDataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class App extends Component<*, Props, State> {
  props: Props;
  dataSource: Object;
  todayDataSource: Object;

  renderRow: Function;
  renderSectionHeader: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      // lessons: [],
      loading: true,
    };
    this.dataSource = DataSource.cloneWithRowsAndSections({});
    this.todayDataSource = TodayDataSource.cloneWithRowsAndSections({});

    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
  }

  state: State;

  componentDidMount() {
    fetchLessons({ studentGroup: ['14TIKOOT'], type: 'today' })
      .then((data) => {
        console.log('foo');
        console.log(data);
        if (!data.reservations || data.reservations.length === 0) {
          console.log('bar');
          this.setState({ loading: false });
          return;
        }
        console.log('baz');
        const lessons: Array<Lesson> = data.reservations
          .map(reservation => parseReservation(reservation))
          .sort((a, b) => moment(a.startDate).isBefore(b.startDate));
        // this.setState({ lessons });
        this.todayDataSource = TodayDataSource.cloneWithRowsAndSections(lessonsToMap(lessons));
        this.setState({ loading: false });
      })
      .catch(error => console.error(error) || this.setState({ loading: true }));
    fetchLessons({ studentGroup: ['14TIKOOT'], type: 'week' })
      .then((data) => {
        console.log('foo');
        console.log(data);
        if (!data.reservations || data.reservations.length === 0) {
          console.log('bar');
          this.setState({ loading: false });
          return;
        }
        console.log('baz');
        const lessons: Array<Lesson> = data.reservations
          .map(reservation => parseReservation(reservation))
          .sort((a, b) => moment(a.startDate).isBefore(b.startDate));
        // this.setState({ lessons });
        this.dataSource = DataSource.cloneWithRowsAndSections(lessonsToMap(lessons));
        this.setState({ loading: false });
      })
      .catch(error => console.error(error) || this.setState({ loading: true }));
  }

  renderRow(lesson: Lesson) {
    return (
      <View style={styles.row} key={lesson.id}>
        <View style={styles.rowDates}>
          <Text style={styles.timeText}>{moment(lesson.startDate).format('HH:mm')}</Text>
          <Text style={styles.timeTextDivider}>-</Text>
          <Text style={styles.timeText}>{moment(lesson.endDate).format('HH:mm')}</Text>
        </View>
        <View
          style={styles.rowCenter}
        >
          <Text style={styles.courseNameText}>{lesson.course.name}</Text>
          <Text style={styles.roomNameText}>{lesson.room}</Text>
        </View>
      </View>
    );
  }

  renderSectionHeader(sectionData: Lesson, sectionId: string) {
    return (
      <View key={sectionId} style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  }

  render(): React.Element<*> {
    return (
      <View>
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
            <Tabs>
              <Content tabLabel="Today">
                <ListView
                  renderRow={this.renderRow}
                  dataSource={this.todayDataSource}
                  initialListSize={0}
                  pageSize={8}
                  scrollRenderAheadDistance={1000}
                  renderSeparator={(sID, rID) =>
                    <View style={styles.separator} key={`${sID}-${rID}`} />
                  }
                  renderSectionHeader={this.renderSectionHeader}
                  style={styles.listView}
                />
                {!this.state.loading && this.todayDataSource.getRowCount() === 0 &&
                  <View style={styles.noLessonsContainer}>
                    <NBText>No lessons today...</NBText>
                  </View>
                }
                {this.state.loading &&
                  <Spinner />
                }
              </Content>
              <Content tabLabel="Week">
                <ListView
                  renderRow={this.renderRow}
                  dataSource={this.dataSource}
                  initialListSize={0}
                  pageSize={8}
                  scrollRenderAheadDistance={1000}
                  renderSeparator={(sID, rID) =>
                    <View style={styles.separator} key={`${sID}-${rID}`} />
                  }
                  renderSectionHeader={this.renderSectionHeader}
                  style={styles.listView}
                />
                {!this.state.loading && this.dataSource.getRowCount() === 0 &&
                  <View style={styles.noLessonsContainer}>
                    <NBText>No lessons this week...</NBText>
                  </View>
                }
                {this.state.loading &&
                  <Spinner />
                }
              </Content>
            </Tabs>
          </Content>
        </Container>
      </View>

    );
  }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingVertical: 4,
  },
  listView: {
    flex: 1,
    flexDirection: 'column',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    marginLeft: 8,
  },
  sectionHeader: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sectionHeaderText: {
    color: 'rgba(0, 0, 0, 0.87)',

  },
  rowDates: {
    alignItems: 'center',
  },
  rowCenter: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  roomNameText: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  courseNameText: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
  timeText: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
  timeTextDivider: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  noLessonsContainer: {
    marginHorizontal: 8,
    marginTop: 16,
    alignItems: 'center',
  },
});

export default App;
