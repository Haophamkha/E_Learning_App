export interface Lesson {
  id: number;
  title: string;
  duration: string;
  status: "completed" | "inprogress" | "not_started";
}

export interface Chapter {
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Project {
  description: string;
}

export interface QA {
  userId: number;
  postDate: string;
  content: string;
  like: number;
  commentCount: number;
}

export interface Review {
  userId: number;
  postDate: string; 
  content: string;
  vote: number; 
}

export interface Course {
  userId: number;
  id: number;
  name: string;
  teacherId: number;
  price: number;
  discount?: number;
  vote: number;
  voteCount: number;
  category: string;
  duration?: string;
  description?: string;
  lessonCount: number;
  image: string;
  project?: Project;
  chapters?: Chapter[];
  QA?: QA[];
  reviews?: Review[];
}



export interface Teacher {
  id: number;
  name: string;
  Job: string;
  location: string;
  timeWork: string;
  image: string;
  school: string;
  userName?: string;
  password?: string;
  vote?: number;
  voteCount?: number;
}



export interface UserCourseProgress {
  [courseId: string]: {
    time_watched: number; 
  };
}

export interface User {
  id: number;
  name: string;
  job: string;
  image: string;
  savedCourseList: number[];
  userName: string;
  password: string;
  purchaseCourse: UserCourseProgress;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Course_Detail: { course: Course };
  Course_Listing: undefined;
  Learning: { learning: Course,updatedLesson?: Lesson };
  TeacherProfile: { teacher: Teacher; courses: Course[] };
  Cart: undefined;
  LessonDetail: {
  title: string;
  lesson: Lesson;
  learning: Course;
  onLessonComplete?: (lesson: Lesson) => void;
};
};

export type RootTabParamList = {
  Home: undefined;
  MyCourse: undefined;
  Course_Searching: undefined;
  UserProfile: {user: User; courses: Course[],teacher: Teacher[]};
};
