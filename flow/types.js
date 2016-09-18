
declare type Resource = {
  id: number;
  type: 'realization' | 'student_group' | 'scheduling_group' | 'room' | 'building';
  code: string;
  name: string;
  parent?: Resource;
};

declare type Reservation = {
  id: number;
  modifiedDate: string;
  subject: string;
  description: string;
  startDate: string;
  endDate: string;
  resources: Array<Resource>;
};

declare type Lesson = {
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
