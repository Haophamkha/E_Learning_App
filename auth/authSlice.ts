import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/type";

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error?: string | null;
}

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("currentUser");
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  }
);

export const saveUserToStorage = createAsyncThunk(
  "auth/saveUserToStorage",
  async (user: User) => {
    await AsyncStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }
);

export const removeUserFromStorage = createAsyncThunk(
  "auth/removeUserFromStorage",
  async () => {
    await AsyncStorage.removeItem("currentUser");
  }
);

const initialState: AuthState = {
  currentUser: null,
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
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    updateCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = { ...action.payload };
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user khi khởi động
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
      })

      // Lưu user (kết hợp loginSuccess)
      .addCase(saveUserToStorage.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })

      .addCase(removeUserFromStorage.fulfilled, (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
      });
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
