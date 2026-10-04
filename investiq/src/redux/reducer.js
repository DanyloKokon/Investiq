import { createAsyncThunk, createSlice, combineReducers } from "@reduxjs/toolkit";
import { fetchData, postUser as addUser, getUser as findUser, postRow as addRow } from '../components/data'
import { saveUserToStorage, getUserFromStorage, clearUserFromStorage } from "../utils/localStorage";

export const getData = createAsyncThunk("users/fetchUsers", async () => {
  return await fetchData()
})
export const postUser = createAsyncThunk("users/postUser", async (newUser) => {
  return await addUser(newUser)
})
export const postRow = createAsyncThunk("rows/postRow", async (row) => {
  console.log(row);
  return await addRow(row)
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

const dataSlice = createSlice({
  name: "table",
  initialState: {
    rows: [],
    status: "idle",
    error: null,
  },
  reducers: {

  },
  extraReducers(builder) {
    builder
      .addCase(getData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rows = action.payload.map((row) => ({
          ...row
        }))
        console.log(state.rows);
      })
      .addCase(getData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      })

  }
})


export const { } = accountSlice.actions;

export const rootReducer = combineReducers({
  users: accountSlice.reducer,
  rows: dataSlice.reducer,
});