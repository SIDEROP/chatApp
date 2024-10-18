import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/getAllUsers",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    getAllUser: {
      users: [],
      loading: false,
      error: null,
    },
    profileOpen: false,
    chatOpen:true,
  },
  reducers: {
    setProfileOpen: (state, action) => {
      state.profileOpen = !state.profileOpen
    },
    setChatOpen:(state,action)=>{
      state.chatOpen = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.getAllUser.loading = true;
        state.getAllUser.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.getAllUser.loading = false;
        state.getAllUser.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.getAllUser.loading = false;
        state.getAllUser.error = action.payload;
      });
  },
});
// Export the action to be used in components
export const { setProfileOpen,setChatOpen } = userSlice.actions;

export default userSlice.reducer;



