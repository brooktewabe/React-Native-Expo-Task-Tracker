import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  authenticated: false,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.authenticated = true;
    },
    setUserData(state, action) {
      state.userData = action.payload.userData;
    },
  },
});

export const { loginSuccess, setUserData } = authSlice.actions;
export default authSlice.reducer;
