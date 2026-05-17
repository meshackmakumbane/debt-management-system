import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

const initialState = {
  settings: null,
  status: 'idle',
  error: null
}

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try{
      const { data } = await api.get("/api/settings");
      return data;
    }catch(error){
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
    }
  }
)

export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async ( settings, { rejectWithValue }) => {
    try{
      const { data } = await api.put("/api/settings", settings);
      return data;
    }catch(error){
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
    }
  }
)

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      //Save settings
      .addCase(saveSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
})

export default settingSlice.reducer