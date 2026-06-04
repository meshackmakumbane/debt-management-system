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
      const {data} = await api.get('/users/overview')
      return data
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
        state.error = null
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.overview = action.payload
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  }
})

export default overviewSlice.reducer