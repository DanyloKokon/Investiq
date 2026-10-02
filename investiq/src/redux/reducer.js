import { createAsyncThunk, createSlice, combineReducers } from "@reduxjs/toolkit";
import { fetchItems, postUser as addUser, getUser as findUser } from '../components/data'
import { saveUserToStorage, getUserFromStorage, clearUserFromStorage } from "../utils/localStorage";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return await fetchItems()
})
export const postUser = createAsyncThunk("users/postUser", async (newUser) => {
  return await addUser(newUser)
})
export const getUser = createAsyncThunk("users/getUser", async (user) => {
  return await findUser(user)
})

const storedUser = getUserFromStorage();

const accountSlice = createSlice({
  name: "account",
  initialState: {
    user: storedUser ? (Array.isArray(storedUser) ? storedUser : [storedUser]) : [],
    isLogined: storedUser ? true : false,
    status: "idle",
    error: null,
  },
  reducers: {

  },
  extraReducers(builder) {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const user = action.payload[0];
        if (user) state.user.push(user);
        saveUserToStorage(user)
        state.isLogined = true
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      })

  }
})


export const { } = accountSlice.actions;

export const rootReducer = combineReducers({
  users: accountSlice.reducer,
});