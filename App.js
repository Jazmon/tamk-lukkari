// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
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
  Icon,
  Button,
} from 'native-base';
import moment from 'moment';

import 'moment/locale/fi';

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
    return key;
  });
  return map;
}

type Props = {
};

type State = {
  // lessons: Array<Lesson>;
};

const DataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class App extends Component<*, Props, State> {
  props: Props;
  dataSource: Object;

  renderRow: Function;
  renderSectionHeader: Function;

  constructor(props: Props) {
    super(props);

    this.state = {
      // lessons: [],
    };
    this.dataSource = DataSource.cloneWithRowsAndSections({});

    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
  }

  state: State;

  componentDidMount() {
    fetchLessons({ studentGroup: ['14TIKOOT'] })
      .then((data) => {
        const lessons: Array<Lesson> = data.reservations
          .map(reservation => parseReservation(reservation))
          .sort((a, b) => moment(a.startDate).isBefore(b.startDate));
        // this.setState({ lessons });
        this.dataSource = DataSource.cloneWithRowsAndSections(lessonsToMap(lessons));
      })
      .catch(error => console.error(error));
  }

  renderRow(lesson: Lesson) {
    return (
      <View style={styles.row} key={lesson.id}>
        <View style={styles.rowDates}>
          <Text>{moment(lesson.startDate).format('HH:mm')}</Text>
          <Text>-</Text>
          <Text>{moment(lesson.endDate).format('HH:mm')}</Text>
        </View>
        <View
          style={styles.rowCenter}
        >
          <Text>{lesson.course.name}</Text>
          <Text>{lesson.room}</Text>
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
      <Container>
        <Header>
          <Button transparent>
            <Icon name="md-menu" />
          </Button>
          <Title>Your Lessons</Title>
        </Header>
        <Content>
          <ListView
            renderRow={this.renderRow}
            dataSource={this.dataSource}
            initialListSize={0}
            pageSize={8}
            scrollRenderAheadDistance={1000}
            renderSeparator={() => <View style={styles.separator} />}
            renderSectionHeader={this.renderSectionHeader}
            style={styles.listView}
          />

        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    // borderColor: '#0f0', borderWidth: 1,
    paddingLeft: 8,
    paddingVertical: 4,
  },
  listView: {
    flex: 1,
    flexDirection: 'column',
    // marginHorizontal: 8,
  },
  separator: {
    // height: StyleSheet.hairlineWidth,
    height: 1,
    backgroundColor: '#EEEEEE',
    marginLeft: 8,
  },
  sectionHeader: {
    // borderColor: '#f00', borderWidth: 1,
    backgroundColor: '#81D4FA',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sectionHeaderText: {
    color: '#000',

  },
  rowDates: {
    alignItems: 'center',
  },
  rowCenter: {
    flex: 1,
    marginHorizontal: 16,
    justifyContent: 'center',
  },
  // container: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   backgroundColor: '#fff',
  // },
  // text: {
  //   color: '#000',
  //   fontSize: 16,
  // },
});

export default App;
