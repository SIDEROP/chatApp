import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

let { VITE_API_URL } = import.meta.env;

// Define the async thunk for registration
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/v1/auth/register`,
        userData,
        { withCredentials: true }
      );
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/v1/auth/login`,
        credentials,
        { withCredentials: true }
      );
      toast.success(response.data?.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const reLogin = createAsyncThunk("auth/reLogin", async (_, thunkAPI) => {
  try {
    const response = await axios.post(
      `${VITE_API_URL}/api/v1/auth/relogin`,
      {},
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Async thunk to log out the user
export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${VITE_API_URL}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    register: {
      loading: false,
      error: null,
      data: null,
    },
    login: {
      loading: false,
      error: null,
      data: null,
    },
    reLogin: {
      loading: false,
      error: null,
      authenticat: false,
      authenticatData: null,
    },
  },
  reducers: {
    increment: (state) => {
      // Define the reducer logic here if needed
    },
  },
  extraReducers: (builder) => {
    // Register cases
    builder
      .addCase(register.pending, (state) => {
        state.register.loading = true;
        state.register.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
        state.register.data = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = action.payload;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.login.loading = true;
        state.login.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.payload;
      })
      // ReLogin cases
      .addCase(reLogin.pending, (state) => {
        state.reLogin.loading = true;
        state.reLogin.error = null;
      })
      .addCase(reLogin.fulfilled, (state, action) => {
        state.reLogin.loading = false;
        state.reLogin.authenticat = true;
        state.reLogin.authenticatData = action.payload;
      })
      .addCase(reLogin.rejected, (state, action) => {
        state.reLogin.loading = false;
        state.reLogin.error = action.payload;
        state.reLogin.authenticat = false;
      }) // logOut
      .addCase(logOut.pending, (state) => {
        state.reLogin.loading = true;
        state.reLogin.error = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.reLogin.loading = false;
        state.reLogin.authenticat = false;
        state.reLogin.authenticatData = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.reLogin.loading = false;
        state.reLogin.error = action.payload;
        state.reLogin.authenticat = false;
      });
  },
});

export const { increment } = authSlice.actions;

export default authSlice.reducer;
