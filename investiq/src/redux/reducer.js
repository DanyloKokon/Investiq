import { createAsyncThunk, createSlice, combineReducers } from "@reduxjs/toolkit";

import { saveUserToStorage, getUserFromStorage, clearUserFromStorage } from "../utils/localStorage";



const storedUser = getUserFromStorage();
console.log(storedUser);

const setCurrentUser = (state, user) => {
  state.user = user ? [user] : [];
  state.isLogined = Boolean(user);
  if (user) {
    saveUserToStorage(user);
  } else {
    clearUserFromStorage();
  }
};

const accountSlice = createSlice({
  name: "account",
  initialState: {
    user: storedUser ? (Array.isArray(storedUser) ? storedUser : [storedUser]) : [],
    balance: 0,
    isLogined: storedUser ? true : false,
    status: "idle",
    error: null,
  },
  reducers: {
    setAuthUser(state, action) {
      setCurrentUser(state, action.payload);
    },
    setBalance(state, action){
      state.balance = action.payload
    },
    setLogOut(state){
      state.isLogined = false
    }
  },
  
})

const dataSlice = createSlice({
  name: "table",
  initialState: {
    rows: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setRows(state, action){
      state.rows = action.payload
     
    }
  },

})


export const { setAuthUser, setBalance } = accountSlice.actions;
export const { setRows } = dataSlice.actions;

export const rootReducer = combineReducers({
  users: accountSlice.reducer,
  rows: dataSlice.reducer,
});