import { createAsyncThunk, createSlice, combineReducers } from "@reduxjs/toolkit";
import { fetchData, postUser as addUser, getUser as findUser, postRow as addRow, deleteRow as deleteInfo, postUserBalance as postBalance } from '../components/data'
import { saveUserToStorage, getUserFromStorage, clearUserFromStorage } from "../utils/localStorage";

/** @type {import("@reduxjs/toolkit").AsyncThunk<any, { user_id: string | number }, import("@reduxjs/toolkit").AsyncThunkConfig>} */
export const getData = createAsyncThunk("users/fetchUsers", async (user_id) => {
  return await fetchData(user_id)
})
export const postUser = createAsyncThunk("users/postUser", async (newUser) => {
  return await addUser(newUser)
})
export const postUserBalance = createAsyncThunk("users/postUser", async (num) => {
  return await postBalance(num)
})
export const postRow = createAsyncThunk("rows/postRow", async (row) => {
  console.log(row);
  return await addRow(row)
})
export const getUser = createAsyncThunk("users/getUser", async (user) => {
  return await findUser(user)
})
// /** @type {import("@reduxjs/toolkit").AsyncThunk<{ user_id: string | number, row_id: string | number }, { user_id: string | number, row_id: string | number }, import("@reduxjs/toolkit").AsyncThunkConfig>} */
export const deleteRow = createAsyncThunk("rows/deleteRow", async (info) => {
  await deleteInfo(info)
  return info
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
      .addCase(deleteRow.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteRow.fulfilled, (state, action) => {
        state.rows = state.rows.filter((row) => row.row_id !== action.payload.row_id);
      })
      .addCase(deleteRow.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete row";
      })

  }
})


export const { } = accountSlice.actions;

export const rootReducer = combineReducers({
  users: accountSlice.reducer,
  rows: dataSlice.reducer,
});