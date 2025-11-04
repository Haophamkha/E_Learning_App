import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Course, QA, Teacher, User, Project } from "../types/type";
import { supabase } from "./supabaseClient";

export const fetchAppData = createAsyncThunk<
  { courses: Course[]; teachers: Teacher[]; users: User[] },
  void,
  { rejectValue: string }
>("data/fetchAppData", async (_, { rejectWithValue }) => {
  try {
    const { data: coursesData, error: coursesErr } = await supabase.rpc(
      "get_courses"
    );
    const { data: teachersData, error: teachersErr } = await supabase.rpc(
      "get_teachers"
    );
    const { data: usersData, error: usersErr } = await supabase.rpc(
      "get_users"
    );

    if (coursesErr || teachersErr || usersErr)
      throw new Error(
        coursesErr?.message ||
          teachersErr?.message ||
          usersErr?.message ||
          "Unknown RPC error"
      );

    return {
      courses: (coursesData?.[0] as any)?.data || [],
      teachers: (teachersData?.[0] as any)?.data || [],
      users: (usersData?.[0] as any)?.data || [],
    };
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch app data via RPC");
  }
});

interface AddUserInput {
  user_name: string;
  job: string;
  image: string;
  username: string;
  password: string;
}

export const addUser = async (input: AddUserInput): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: input.user_name,
          job: input.job,
          image: input.image,
          username: input.username,
          password: input.password,
          savedcourselist: [], // luôn là array rỗng
          purchasecourse: {}, // luôn là object rỗng
          cart: [], // luôn là array rỗng
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Add user error:", error.message);
      return null;
    }

    if (!data) return null;

    // Chuẩn hóa kiểu dữ liệu cho frontend
    const newUser: User = {
      id: data.id,
      name: data.name,
      job: data.job,
      image: data.image,
      username: data.username,
      password: data.password,
      savedcourselist: Array.isArray(data.savedcourselist)
        ? data.savedcourselist
        : [],
      purchasecourse: data.purchasecourse || {},
      cart: Array.isArray(data.cart) ? data.cart : [],
    };

    return newUser;
  } catch (err) {
    console.error("Add user exception:", err);
    return null;
  }
};

export const addToCart = async (
  currentUser: User,
  course: Course
): Promise<User | null> => {
  try {
    if (!currentUser?.id) {
      console.error("❌ No user logged in");
      return null;
    }

    // 1️⃣ Clone lại giỏ hàng hiện tại
    let cart: number[] = Array.isArray(currentUser.cart)
      ? [...currentUser.cart]
      : [];

    // 2️⃣ Kiểm tra xem course đã có trong cart chưa
    const alreadyInCart = cart.includes(course.id);

    if (alreadyInCart) {
      console.log(`⚠️ Course "${course.name}" already in cart.`);
      return currentUser; // Không thêm lại
    }

    // 3️⃣ Thêm course ID mới
    cart.push(course.id);

    // 4️⃣ Cập nhật lên Supabase
    const { data, error } = await supabase
      .from("users")
      .update({ cart })
      .eq("id", currentUser.id)
      .select()
      .single();

    if (error) {
      console.error("❌ Update cart error:", error.message);
      return null;
    }

    if (!data) return null;

    // 5️⃣ Trả về user mới đã cập nhật cart
    const updatedUser: User = {
      id: data.id,
      name: data.name,
      job: data.job,
      image: data.image,
      username: data.username,
      password: data.password,
      savedcourselist: Array.isArray(data.savedcourselist)
        ? data.savedcourselist
        : [],
      purchasecourse: data.purchasecourse || {},
      cart: Array.isArray(data.cart) ? data.cart : [],
    };

    console.log(`✅ Added "${course.name}" to cart.`);
    return updatedUser;
  } catch (err) {
    console.error("❌ Add to cart exception:", err);
    return null;
  }
};

//saved course
export const toggleSavedCourse = async (
  currentUser: User,
  courseId: number
): Promise<User | null> => {
  try {
    if (!currentUser?.id) {
      return null;
    }

    // Clone mảng savedcourselist hiện tại
    let savedList: number[] = Array.isArray(currentUser.savedcourselist)
      ? [...currentUser.savedcourselist]
      : [];

    // Kiểm tra nếu đã có thì xóa, chưa có thì thêm
    if (savedList.includes(courseId)) {
      savedList = savedList.filter((id) => id !== courseId);
    } else {
      savedList.push(courseId);
    }

    // Cập nhật Supabase
    const { data, error } = await supabase
      .from("users")
      .update({ savedcourselist: savedList })
      .eq("id", currentUser.id)
      .select()
      .single();

    if (error) {
      return null;
    }

    if (!data) return null;

    // Trả về user mới
    const updatedUser: User = {
      id: data.id,
      name: data.name,
      job: data.job,
      image: data.image,
      username: data.username,
      password: data.password,
      savedcourselist: Array.isArray(data.savedcourselist)
        ? data.savedcourselist
        : [],
      purchasecourse: data.purchasecourse || {},
      cart: Array.isArray(data.cart) ? data.cart : [],
    };

    return updatedUser;
  } catch (err) {
    return null;
  }
};

//Thêm StudentProject vào Project của khóa học
export const addStudentProjectToProject = async (
  courseId: number,
  userId: number,
  nameprj: string,
  imageprj: string,
  resourse: any[]
): Promise<Project | null> => {
  try {
    const { data, error } = await supabase.rpc("add_studentproject_to_project", {
      p_course_id: courseId,
      p_user_id: userId,
      p_nameprj: nameprj,
      p_imageprj: imageprj,
      p_resourse: resourse,
    });

    if (error) {
      console.error("❌ addStudentProjectToProject error:", error.message);
      return null;
    }

    return data as Project;
  } catch (err) {
    console.error("❌ addStudentProjectToProject exception:", err);
    return null;
  }
};

export const addStudentProjectToCourse = createAsyncThunk(
  "courses/addStudentProjectToCourse",
  async (
    {
      courseId,
      studentProject,
    }: {
      courseId: number;
      studentProject: any;
    },
    { rejectWithValue }
  ) => {
    try {
      // Lấy course hiện tại
      const { data: existingCourse, error: fetchError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (fetchError) throw fetchError;

      const existingProject = existingCourse.project || {
        description: "",
        studentproject: [],
      };

      // Thêm project mới
      const updatedList = [
        ...(existingProject.studentproject || []),
        studentProject,
      ];

      // Cập nhật Supabase
      const { data, error } = await supabase
        .from("courses")
        .update({
          project: { ...existingProject, studentproject: updatedList },
        })
        .eq("id", courseId)
        .select()
        .single();

      if (error) throw error;

      // ✅ Trả về course đã được cập nhật hoàn chỉnh
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Mua khóa học 
export const addToPurchaseCourse = async (
  currentUser: any,
  course: any
): Promise<any | null> => {
  try {
    if (!currentUser?.id) {
      return null;
    }

    const { data, error } = await supabase.rpc(
      "add_course_to_purchasecourse",
      {
        p_user_id: currentUser.id,
        p_course_id: course.id,
      }
    );

    if (error) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
};

export const addQAtoCourse = async (
  courseId: number,
  userId: number,
  content: string
): Promise<QA[] | null> => {
  try {
    const postdate = new Date().toISOString(); 

    const { data, error } = await supabase.rpc("add_qa_to_course", {
      p_course_id: courseId,
      p_user_id: userId,
      p_postdate: postdate,
      p_content: content,
      p_like: 0,
      p_commentcount: 0,
    });

    if (error) {
      return null;
    }

    return data; 
  } catch (err) {
    return null;
  }
};


interface DataState {
  courses: Course[];
  teachers: Teacher[];
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  courses: [],
  teachers: [],
  users: [],
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateUser(state, action: { payload: User }) {
      const updatedUser = action.payload;
      const index = state.users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) state.users[index] = updatedUser;
    },
    updateCourseQA(state, action: { payload: { courseId: number; qa: QA[] } }) {
      const { courseId, qa } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (course) course.qa = qa;
    },
    updateCourseProject(
      state,
      action: { payload: { courseId: number; project: Project } }
    ) {
      const { courseId, project } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (course) course.project = project;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppData.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.teachers = action.payload.teachers;
        state.users = action.payload.users;
      })
      .addCase(fetchAppData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(addStudentProjectToCourse.fulfilled, (state, action) => {
        const updatedCourse = action.payload;
        const existing = state.courses.find((c) => c.id === updatedCourse.id);
        if (existing) {
          existing.project = updatedCourse.project;
        }
      });

  },
});

export const { updateUser, updateCourseQA, updateCourseProject } = dataSlice.actions;
export default dataSlice.reducer;
