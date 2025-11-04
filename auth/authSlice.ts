import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/type";

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error?: string | null;
}

// Lưu user = localStorage
const storedUser = localStorage.getItem("currentUser");

const initialState: AuthState = {
  currentUser: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      localStorage.removeItem("currentUser"); 
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = { ...action.payload };
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updateCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;
