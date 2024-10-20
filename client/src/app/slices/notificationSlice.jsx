import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
let { VITE_API_URL } = import.meta.env;


export const deleteNotificationApi = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      // Send notificationId as an object with key 'notificationId'
      const response = await axios.post(
        `${VITE_API_URL}/api/v1/notification/delete`,
        { notificationId }, // Send notificationId inside an object
        { withCredentials: true }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    deleteNotifications: {
      notifications: [],
      loading: false,
      error: null,
    },
    userNotifications: {
      notifications: [],
      loading: false,
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle deleteNotificationApi actions
      .addCase(deleteNotificationApi.pending, (state) => {
        state.deleteNotifications.loading = true;
        state.deleteNotifications.error = null;
      })
      .addCase(deleteNotificationApi.rejected, (state, action) => {
        state.deleteNotifications.loading = false;
        state.deleteNotifications.error = action.payload || "An error occurred";
      })
      
  },
});

export default notificationSlice.reducer;

