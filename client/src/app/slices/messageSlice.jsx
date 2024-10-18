import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { clearChat } from "./chatSlice"; // Import clearChat action

// Async Thunk for sending a message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ receiverId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/message/sendMessage/${receiverId}`,
        { content },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for deleting messages
export const deleteMessageApi = createAsyncThunk(
  "messages/deleteMessageApi",
  async (receiverId, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/message/delete/${receiverId}`,
        { withCredentials: true }
      );

      // Dispatch clearChat to reset the chat in chatSlice
      dispatch(clearChat());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  sendMessage: {
    messages: [], // Sent messages array
    loading: false,
    error: null,
  },
  deleteMessage: {
    loading: false, // Loading state for deleting messages
    error: null,    // Error state for deletion
  },
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle sendMessage async thunk
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sendMessage.loading = true;
        state.sendMessage.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendMessage.loading = false;
        state.sendMessage.messages.push(action.payload.message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendMessage.loading = false;
        state.sendMessage.error = action.payload;
      });

    // Handle deleteMessageApi async thunk
    builder
      .addCase(deleteMessageApi.pending, (state) => {
        state.deleteMessage.loading = true;
        state.deleteMessage.error = null;
      })
      .addCase(deleteMessageApi.fulfilled, (state, action) => {
        state.deleteMessage.loading = false;
        state.sendMessage.messages = []; // Clear the messages array
      })
      .addCase(deleteMessageApi.rejected, (state, action) => {
        state.deleteMessage.loading = false;
        state.deleteMessage.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
