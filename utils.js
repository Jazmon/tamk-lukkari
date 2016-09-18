import moment from 'moment';

export function parseReservation(reservation: Reservation): Lesson {
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

export function lessonsToMap(lessons: Array<Lesson>): Object {
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
