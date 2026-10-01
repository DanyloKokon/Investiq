import { createAsyncThunk, createSlice, combineReducers } from "@reduxjs/toolkit";
import { fetchItems } from '../components/data'

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await fetchItems()
})

const accountSlice = createSlice({
  name: "account",
  initialState: {
    user: [],
    status: "idle",
    error: null,
  },
  reducers: {

  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.map((item) => ({
          ...item,
          id: Number(item.user_id),
        }));
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  }
})


export const { } = accountSlice.actions;

export const rootReducer = combineReducers({
  users: accountSlice.reducer,
});