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

export interface ResourceFile {
  url: string;
  size: string;
}

export interface StudentProject {
  userid: number;
  nameprj: string;
  imageprj: string;
  resourse: ResourceFile[];
}

export interface Project {
  description: string;
  studentproject: StudentProject[];
}

export interface QA {
  userid: number;
  postdate: string;
  content: string;
  like: number;
  commentcount: number;
}

export interface Review {
  userId: number;
  postDate: string;
  content: string;
  vote: number;
}

export interface Course {
  userid: number;
  id: number;
  name: string;
  teacherid: number;
  price: number;
  discount?: number;
  vote: number;
  votecount: number;
  likes: number;
  share: number;
  category: string;
  duration?: string;
  description?: string;
  lessoncount: number;
  image: string;
  project?: Project;
  chapters?: Chapter[];
  qa?: QA[];
  reviews?: Review[];
}

export interface Teacher {
  id: number;
  name: string;
  job: string;
  location: string;
  timework: string;
  image: string;
  school: string;
  username?: string;
  password?: string;
  vote?: number;
  votecount?: number;
  status: "active" | "inactive";
}

export interface UserCourseProgress {
  [courseid: string]: {
    time_watched: number;
  };
}

export interface User {
  id: number;
  name: string;
  job: string;
  image: string;
  savedcourselist: number[];
  username: string;
  password: string;
  purchasecourse: UserCourseProgress;
  cart: number[];
}

export type RootStackParamList = {
  MainTabs: undefined;
  Course_Detail: {
    course: Course;
    teachers?: Teacher[];
    courses?: Course[];
    users?: User[];
  };
  Course_Listing: { keyword?: string; category?: string };
  Learning: { course: Course };
  TeacherProfile: { teacher: Teacher; courses: Course[] };
  Cart: { courses: Course[]; user: User };
};

export type RootTabParamList = {
  Home: undefined;
  MyCourse: undefined;
  Course_Searching: undefined;
  UserProfile: { user?: User; courses?: Course[]; teacher?: Teacher[] };
};

export type Database = {
  public: {
    Tables: {
      courses: Course;
      teachers: Teacher;
      users: User;
    };
  };
};
