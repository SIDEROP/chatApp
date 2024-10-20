import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { removeNotification } from "../../utils/isUserIdInNotifications ";
import { userChatFilterRecever } from "../../utils/getLastChatContent";

let { VITE_API_URL } = import.meta.env;
// Fetch user's chat participants
export const getUserParticipants = createAsyncThunk(
  "chat/getUserParticipants",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${VITE_API_URL}/api/v1/chat/getUserParticipants`,
        { withCredentials: true }
      );
      return response.data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch user's chat with a specific participant
export const getUserChat = createAsyncThunk(
  "chat/getUserChat",
  async (receiverId, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${VITE_API_URL}/api/v1/chat/getUserChat/${receiverId}`,
        { withCredentials: true }
      );
      return data?.data?.messages;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching notifications
export const getNotification = createAsyncThunk(
  "notification/getNotification",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${VITE_API_URL}/api/v1/notification/get`,
        { withCredentials: true }
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a participant and their messages
export const deleteParticipantAndMessagesApi = createAsyncThunk(
  "chat/deleteParticipantAndMessagesApi",
  async (receiverId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${VITE_API_URL}/api/v1/chat/delete/${receiverId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    getUserParticipants: {
      participants: [],
      loading: false,
      error: null,
    },
    getUserChat: {
      receiverIdUser: null,
      chat: [],
      loading: true,
      error: null,
    },
    // notifications: [],
    userNotifications: {
      notifications: [],
      loading: false,
      error: null,
    },
    deleteParticipant: {
      loading: false,
      error: null,
    },
    typingUsers:[]
  },
  reducers: {
    setUserCrentId: (state, action) => {
      state.getUserChat.receiverIdUser = action.payload;
    },
    setUserChat: (state, action) => {
      state.getUserChat.chat = action.payload;
    },
    setNotifications: (state, action) => {
      state.userNotifications.notifications.push(action.payload);
    },
    deleteNotification: (state, action) => {
      state.userNotifications.notifications = removeNotification(
        state.userNotifications.notifications,
        action.payload
      );
    },
    setUserParticipants: (state, action) => {
      state.getUserParticipants.participants.push(action.payload);
    },
    clearChat: (state) => {
      state.getUserChat.chat = [];
    },
    deleteUserChat: (state, action) => {
      console.log(
        "test",
        action.payload,
        state.getUserChat.receiverIdUser?._id
      );
      if (state.getUserChat.receiverIdUser?._id == action.payload) {
        state.getUserChat.chat = [];
      }
    },
    setDeleteParticipant: (state, action) => {
      if (action.payload) {
        state.getUserParticipants.participants =
          state.getUserParticipants.participants.filter(
            (data) => data._id !== action.payload
          );
      }
    },
    setTypingUsers: (state, action) => {
      state.typingUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch user participants cases
    builder
      .addCase(getUserParticipants.pending, (state) => {
        state.getUserParticipants.loading = true;
        state.getUserParticipants.error = null;
      })
      .addCase(getUserParticipants.fulfilled, (state, action) => {
        state.getUserParticipants.loading = false;
        state.getUserParticipants.participants = action.payload;
      })
      .addCase(getUserParticipants.rejected, (state, action) => {
        state.getUserParticipants.loading = false;
        state.getUserParticipants.error = action.payload;
      })
      // Fetch user chat cases
      .addCase(getUserChat.pending, (state) => {
        state.getUserChat.loading = true;
        state.getUserChat.error = null;
      })
      .addCase(getUserChat.fulfilled, (state, action) => {
        state.getUserChat.loading = false;
        state.getUserChat.chat = action.payload; // Update to match array
      })
      .addCase(getUserChat.rejected, (state, action) => {
        state.getUserChat.loading = false;
        state.getUserChat.error = action.payload;
        state.getUserChat.chat = [];
      })
      // Handle getNotification actions
      .addCase(getNotification.pending, (state) => {
        state.userNotifications.loading = true;
        state.userNotifications.error = null;
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        state.userNotifications.loading = false;
        state.userNotifications.notifications = action.payload;
        state.notifications = action.payload;
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.userNotifications.loading = false;
        state.userNotifications.error = action.payload || "An error occurred";
      })
      // Handle deleteParticipantAndMessagesApi actions
      .addCase(deleteParticipantAndMessagesApi.pending, (state) => {
        state.deleteParticipant.loading = true;
        state.deleteParticipant.error = null;
      })
      .addCase(deleteParticipantAndMessagesApi.fulfilled, (state, action) => {
        const { _id } = action.payload?.data;
        console.log(_id);
        state.deleteParticipant.loading = false;
        state.getUserChat.chat = [];
        state.getUserParticipants.participants =
          state.getUserParticipants.participants.filter(
            (participant) => participant._id !== _id
          );
      })

      .addCase(deleteParticipantAndMessagesApi.rejected, (state, action) => {
        state.deleteParticipant.loading = false;
        state.deleteParticipant.error = action.payload || "An error occurred";
      });
  },
});

export const {
  setUserCrentId,
  setUserChat,
  setNotifications,
  deleteNotification,
  clearChat,
  setUserParticipants,
  deleteUserChat,
  setDeleteParticipant,
  setTypingUsers,
} = chatSlice.actions;

export default chatSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { removeNotification } from "../../utils/isUserIdInNotifications ";

// // Fetch user's chat participants
// export const getUserParticipants = createAsyncThunk(
//   "chat/getUserParticipants",
//   async (_, thunkAPI) => {
//     try {
//       const response = await axios.get(
//         `${VITE_API_URL}/api/v1/chat/getUserParticipants`,
//         { withCredentials: true }
//       );
//       return response.data?.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// // Fetch user's chat with a specific participant
// export const getUserChat = createAsyncThunk(
//   "chat/getUserChat",
//   async (receiverId, thunkAPI) => {
//     try {
//       const { data } = await axios.get(
//         `${VITE_API_URL}/api/v1/chat/getUserChat/${receiverId}`,
//         { withCredentials: true }
//       );
//       return data?.data?.messages;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async thunk for fetching notifications
// export const getNotification = createAsyncThunk(
//   "notification/getNotification",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(
//         "${VITE_API_URL}/api/v1/notification/get",
//         { withCredentials: true }
//       );
//       return data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// const chatSlice = createSlice({
//   name: "chat",
//   initialState: {
//     getUserParticipants: {
//       participants: [],
//       loading: false,
//       error: null,
//     },
//     getUserChat: {
//       receiverIdUser: null,
//       chat: [], // Initialize as an empty array
//       loading: false,
//       error: null,
//     },
//     notifications: [],
//     userNotifications: {
//       notifications: [],
//       loading: false,
//       error: null,
//     },
//   },
//   reducers: {
//     setUserCrentId: (state, action) => {
//       state.getUserChat.receiverIdUser = action.payload;
//     },
//     setUserChat: (state, action) => {
//       state.getUserChat.chat = action.payload;
//     },
//     setNotifications: (state, action) => {
//       state.notifications.push(action.payload);
//     },
//     deleteNotification: (state, action) => {
//       state.notifications = removeNotification(
//         state.notifications,
//         action.payload
//       );
//     },
//   },
//   extraReducers: (builder) => {
//     // Fetch user participants cases
//     builder
//       .addCase(getUserParticipants.pending, (state) => {
//         state.getUserParticipants.loading = true;
//         state.getUserParticipants.error = null;
//       })
//       .addCase(getUserParticipants.fulfilled, (state, action) => {
//         state.getUserParticipants.loading = false;
//         state.getUserParticipants.participants = action.payload;
//       })
//       .addCase(getUserParticipants.rejected, (state, action) => {
//         state.getUserParticipants.loading = false;
//         state.getUserParticipants.error = action.payload;
//       })
//       // Fetch user chat cases
//       .addCase(getUserChat.pending, (state) => {
//         state.getUserChat.loading = true;
//         state.getUserChat.error = null;
//       })
//       .addCase(getUserChat.fulfilled, (state, action) => {
//         state.getUserChat.loading = false;
//         state.getUserChat.chat = action.payload; // Update to match array
//       })
//       .addCase(getUserChat.rejected, (state, action) => {
//         state.getUserChat.loading = false;
//         state.getUserChat.error = action.payload;
//         state.getUserChat.chat = [];
//       })
//       // Handle getNotification actions
//       .addCase(getNotification.pending, (state) => {
//         state.userNotifications.loading = true;
//         state.userNotifications.error = null;
//       })
//       .addCase(getNotification.fulfilled, (state, action) => {
//         state.userNotifications.loading = false;
//         state.userNotifications.notifications = action.payload;
//         state.notifications = action.payload;
//       })
//       .addCase(getNotification.rejected, (state, action) => {
//         state.userNotifications.loading = false;
//         state.userNotifications.error = action.payload || "An error occurred";
//       });
//   },
// });

// export const {
//   setUserCrentId,
//   setUserChat,
//   setNotifications,
//   deleteNotification,
// } = chatSlice.actions;

// export default chatSlice.reducer;
