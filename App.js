// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  List,
  ListItem,
  Text,
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
  const room: string = roomResource ? roomResource.code : '';
  const splitCourse: Array<string> = reservation.subject.split(' ');
  const lesson: Lesson = {
    id: reservation.id,
    course: {
      name: splitCourse.slice(0, splitCourse.length - 2).join(' '),
      id: splitCourse[splitCourse.length - 1],
    },
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    room,
    studentGroups: reservation.resources
      .filter(res => res.type === 'student_group')
      .map(res => res.code),
  };
  return lesson;
}

type Props = {
};

type State = {
  lessons: Array<Lesson>;
};


class App extends Component<*, Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      lessons: [],
    };
  }

  state: State;

  componentDidMount() {
    fetchLessons({ studentGroup: ['14TIKOOT'] })
      .then((data) => {
        const lessons: Array<Lesson> = data.reservations
          .map(reservation => parseReservation(reservation))
          .sort((a, b) => moment(a.startDate).isBefore(b.startDate));
      })
      .catch(error => console.error(error));
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
          <List
            dataArray={this.state.lessons}
            renderRow={lesson => (
              <ListItem key={lesson.id}>
                <View style={styles.listItem}>
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <Text>{moment(listData.startDate).format('DD.MM.')}</Text>
                    <Text>{moment(listData.startDate).format('HH:mm')}</Text>
                    <Text>-</Text>
                    <Text>{moment(listData.endDate).format('HH:mm')}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginHorizontal: 16,
                      justifyContent: 'center',
                    }}
                  >
                    <Text>{listData.course.name}</Text>
                    <Text>{listData.room}</Text>
                  </View>
                </View>
              </ListItem>

            )}
          />
        </Content>
      </Container>
    );
  }
}
// {/* <View key={lesson.id} style={styles.listItem}>
//   <Text>{lesson.title}</Text>
// </View> */}
const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
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
