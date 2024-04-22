import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null as string | null,
  authenticated: false,
  user: null as any,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.authenticated = true;
      state.user = action.payload.user;
    },
    clearAuth(state) {
      state.token = null;
      state.authenticated = false;
      state.user = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
