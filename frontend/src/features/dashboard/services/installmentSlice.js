import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../api/axios'

const initialState = {
  installments: [],
  status: "idle",
  errorMessage: null
}

export const fetchInstallments = createAsyncThunk(
  'data/fetchInstallments',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/user/installments')
      return data
    } catch (error) {
      rejectWithValue(
        error.response?.data?.message || "Error fetching installments"
      )
    }
  }
)

const installmentSlice = createSlice({
  name: "data",
  initialState,
  reducers:{},
  extraReducers:(builder) => {
    builder
      //Fetch Active installments
      .addCase(fetchInstallments.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(fetchInstallments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.installments = action.payload.installments
        state.errorMessage = null
      })
      .addCase(fetchInstallments.rejected, (state, action) => {
        state.status = 'failed'
        state.errorMessage = action.payload
      })

  }
})

export default installmentSlice.reducer