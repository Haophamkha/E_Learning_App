import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Course, Teacher, User } from "../types/type";
// 🧠 Kiểu dữ liệu chung cho app (bạn có thể mở rộng thêm)


export interface DataState {
  courses: Course[];
  teachers: Teacher[];
  users: User[];
  loading: boolean;
  error: string | null;
}

// 🎯 State khởi tạo
const initialState: DataState = {
  courses: [],
  teachers: [],
  users: [],
  loading: false,
  error: null,
};

// ⚙️ Async thunk để fetch tất cả data 1 lần
export const fetchAppData = createAsyncThunk(
  "data/fetchAppData",
  async (_, { rejectWithValue }) => {
    try {
      const [coursesRes, teachersRes, usersRes] = await Promise.all([
        axios.get("http://localhost:3000/courses"),
        axios.get("http://localhost:3000/teachers"),
        axios.get("http://localhost:3000/users"), // <-- fetch users
      ]);

      return {
        courses: coursesRes.data,
        teachers: teachersRes.data,
        users: usersRes.data, // <-- trả về users
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// 🧩 Slice quản lý dữ liệu
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
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
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;
