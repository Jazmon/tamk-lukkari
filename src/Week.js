// @flow
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ListView,
  Text,
  RefreshControl,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import 'moment/locale/fi';

import { lessonsToMap } from '../utils';

const DataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

type Props = {
  lessons: Array<Lesson>;
  onRefresh: Function;
};

type State = {
  loading: boolean;
  refreshing: boolean;
};

export default class Week extends Component<*, Props, State> {
  props: Props;
  dataSource: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      // lessons: [],
      loading: false,
      refreshing: false,
    };
    this.dataSource = DataSource.cloneWithRowsAndSections(lessonsToMap(this.props.lessons));
  }

  state: State;

  componentDidMount() {
    this.dataSource = DataSource.cloneWithRowsAndSections(lessonsToMap(this.props.lessons));
  }

  componentWillReceiveProps(nextProps: Props) {
    this.dataSource = DataSource.cloneWithRowsAndSections(lessonsToMap(nextProps.lessons));
  }

  onRefresh = (): void => {
    this.setState({ refreshing: true });
    if (this.props.onRefresh) this.props.onRefresh('week', () => this.setState({ refreshing: false }));
  }

  renderRow = (lesson: Lesson) => (
    <View style={styles.row} key={lesson.id}>
      <View style={styles.rowDates}>
        <Text style={styles.timeText}>{moment(lesson.startDate).format('HH:mm')}</Text>
        <Text style={styles.timeTextDivider}>-</Text>
        <Text style={styles.timeText}>{moment(lesson.endDate).format('HH:mm')}</Text>
      </View>
      <View style={styles.rowCenter}>
        <Text style={styles.courseNameText}>{lesson.course.name}</Text>
        <Text style={styles.roomNameText}>{lesson.room}</Text>
      </View>
      <View style={styles.rowEnd}>
        <Text style={styles.courseIdText}>{lesson.course.id}</Text>
      </View>
    </View>
  );

  renderSectionHeader = (sectionData: Lesson, sectionId: string) => (
    <View key={sectionId} style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{sectionId}</Text>
    </View>
  );

  render(): React.Element<*> {
    const noLessons: boolean = !this.state.loading && this.dataSource.getRowCount() === 0;
    const loading: boolean = this.state.loading;
    return (
      <View style={{ flex: 1 }}>
        <ListView
          renderRow={this.renderRow}
          dataSource={this.dataSource}
          initialListSize={0}
          pageSize={8}
          scrollRenderAheadDistance={1000}
          renderSeparator={(sID, rID) =>
            <View style={styles.separator} key={`${sID}-${rID}`} />
          }
          renderFooter={() => <View style={{ height: 64 }} />}
          renderSectionHeader={this.renderSectionHeader}
          style={styles.listView}
          renderScrollComponent={(props) => <KeyboardAwareScrollView {...props} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
        {noLessons &&
          <View style={styles.noLessonsContainer}>
            <Text>No lessons this week...</Text>
          </View>
        }
        {loading && <ActivityIndicator animating={true} color="#f44336" size="large" />}
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
  rowEnd: {
    marginRight: 16,
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
  courseIdText: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 12,
  },
  noLessonsContainer: {
    marginHorizontal: 8,
    marginTop: 16,
    alignItems: 'center',
  },
});
