import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for deleting a notification
export const deleteNotificationApi = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId, { rejectWithValue }) => {
    try {
      // Send notificationId as an object with key 'notificationId'
      const response = await axios.post(
        "http://localhost:4000/api/v1/notification/delete",
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

// // Async thunk for fetching notifications
// export const getNotification = createAsyncThunk(
//   "notification/getNotification",
//   async (_, { rejectWithValue }) => {
//     try {
//       const {data} = await axios.get(
//         "http://localhost:4000/api/v1/notification/get",
//         { withCredentials: true }
//       );
//       return data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

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
      
      // // Handle getNotification actions
      // .addCase(getNotification.pending, (state) => {
      //   state.userNotifications.loading = true;
      //   state.userNotifications.error = null;
      // })
      // .addCase(getNotification.fulfilled, (state, action) => {
      //   state.userNotifications.loading = false;
      //   state.userNotifications.notifications = action.payload;
      // })
      // .addCase(getNotification.rejected, (state, action) => {
      //   state.userNotifications.loading = false;
      //   state.userNotifications.error = action.payload || "An error occurred";
      // });
  },
});

export default notificationSlice.reducer;


// // Filter out the deleted notification from the notifications array
// state.deleteNotifications.notifications = state.deleteNotifications.notifications.filter(
//     (notification) => notification._id !== action.meta.arg
//   );
