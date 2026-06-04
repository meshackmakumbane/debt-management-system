import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../api/axios'

const initialState = {
  debtors: [],
  status: "idle",
  errorMessage: null
}

export const fetchDebtors = createAsyncThunk(
  'data/fetchDebtors',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/all-debtors')
      return data
    } catch (error) {
      rejectWithValue(
        error.response?.data?.message || "Error fetching installments"
      )
    }
  }
)

const debtorsSlice = createSlice({
  name: "debtors",
  initialState,
  reducers:{},
  extraReducers:(builder) => {
    builder
      //Fetch Debtors
      .addCase(fetchDebtors.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(fetchDebtors.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.payments = action.payload.debtors
        state.errorMessage = null
      })
      .addCase(fetchDebtors.rejected, (state, action) => {
        state.status = 'failed'
        state.errorMessage = action.payload
      })
  }
})

export default debtorsSlice.reducer