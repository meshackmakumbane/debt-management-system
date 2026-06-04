import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../api/axios'

const initialState = {
  payments: [], 
  status: "idle",
  errorMessage: null
}

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/payments')
      return data
    } catch (error) {
      rejectWithValue(
        error.response?.data?.message || "Error fetching payments"
      )
    }
  }
)

const paymentsSlice = createSlice({
  name: "payments",
  initialState, 
  reducers:{},
  extraReducers:(builder) => {
    builder
      //Fetch payments transactions
      .addCase(fetchPayments.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.payments = action.payload.payments
        state.errorMessage = null
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = 'failed'
        state.errorMessage = action.payload
      })
      
  }
})

export default paymentsSlice.reducer