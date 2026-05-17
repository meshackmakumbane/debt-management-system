import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

const initialState = {
  overview: null,
  status: 'idle',
  error: null
}

export const fetchData = createAsyncThunk(
  'overview/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/overview')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred')
    }
  }
)

const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.overviewData = action.payload
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export default overviewSlice.reducer