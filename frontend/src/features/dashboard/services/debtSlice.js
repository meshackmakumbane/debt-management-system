import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../api/axios'

const initialState = {
  debts: [],
  status: "idle",
  errorMessage: null
}

export const fetchDebts = createAsyncThunk(
  'data/fetchDebts',
  async (_, { rejectWithValue }) => {
    try{
      const { data } = await api.get('/debt/debts')
      return data
    }catch(error){
      rejectWithValue(
        error.response?.data?.message || "Error fetching debts"
      ) 
    }
  }
)

const debtSlice = createSlice({
  name: "debt",
  initialState,
  reducers:{},
  extraReducers:(builder) => {
    builder
      //Fetch Active debts
      .addCase(fetchDebts.pending, (state) => {
        state.status = 'loading'
        state.errorMessage = null
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.debts = action.payload.debts
        state.errorMessage = null
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = 'failed'
        state.errorMessage = action.payload
      })
  }
})

export default debtSlice.reducer