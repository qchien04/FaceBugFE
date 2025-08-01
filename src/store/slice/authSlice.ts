import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../utils/type';

// Khởi tạo trạng thái ban đầu
const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<AuthState>) => {
      const { isAuthenticated, user } = action.payload;
      state.isAuthenticated = isAuthenticated;
      state.isInitialized = true;
      state.user = user;
    },
    signIn: (state, action: PayloadAction<AuthState>) => {
      const { user } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
    },
    signOut: (state) => {
      localStorage.removeItem('jwtToken');
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { initialize, signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
