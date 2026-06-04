import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/api'

const initialState = {
  debts: [],
  status: "idle",
  errorMessage: null
}

export const fetchDebts = createAsyncThunk(
  'debts/fetchDebts',
  async (_, { rejectWithValue }) => {
    try{
      const { data } = await api.get('/users/debts')
      return data
    }catch(error){
      return rejectWithValue(
        error.response?.data?.message || "Error fetching debts"
      )
    }
  }
)

const debtSlice = createSlice({
  name: "debts",
  initialState,
  reducers:{},
  extraReducers:(builder) => {
    builder
      /* ---- FETCH ACTIVE DATA(ROLE-BASED) ---- */
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
export const selectDebts = state => state.debt.debts