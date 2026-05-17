import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/api';

const initialState = {
  user: null,
  role: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

/* LOGIN -------------------------------------------------------------------------- */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

/* PROFILE -------------------------------------------------------------------------- */
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/auth/profile');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Not authenticated'
      );
    }
  }
);

/* LOGOUT -------------------------------------------------------------------------- */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get('/auth/logout');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

/* SLICE-------------------------------------------------------------------------- */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   setError:(state, action) => {
      state.error = action.payload
   },
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /*  LOGIN ------------------------------------------------------------ */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.user.role; 
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      /* ----------------------------- PROFILE ---------------------------- */
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      /* ------------------------------ LOGOUT ----------------------------- */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setError, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;