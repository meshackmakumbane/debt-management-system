import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../../api/api'

const initialState = {
  debts: null,
  debtors: null,
  loading: false,
  error: null
}

export const fetchDebts = createAsyncThunk(
  'agent/fetchDebt',
  async(_, {rejectWithValue})=>{
    try{
      const res = await api.get('/admin/debts')
      return res.data
    }catch(err){
      rejectWithValue(err.response?.data?.message || "Error fetching data")
    }
  }
)

export const fetchDebtors = createAsyncThunk(
  'agent/fetchDebtors',
  async(_, {rejectWithValue})=>{
    try{
      const res = await api.get('/admin/agent-debtors')
      return res.data
    }catch(err){
      rejectWithValue(err.response?.data?.message || "Error fetching data")
    }
  }
)

export const agentOverviewSlice = createSlice({
  name:'overview',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder
      //Fetch all debts
      .addCase(fetchDebts.pending, (state)=>{
        state.loading = true
        state.erroe = null
      })
      .addCase(fetchDebts.fulfilled, (state, action)=>{
        state.loading = false
        state.debts = action.payload.debts
        state.error = null
      })
      .addCase(fetchDebts.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload
      })

      //Fetch all debtors
      .addCase(fetchDebtors.pending, (state)=>{
        state.loading = true
        state.erroe = null
      })
      .addCase(fetchDebtors.fulfilled, (state, action)=>{
        state.loading = false
        state.debts = action.payload.debtors
        state.error = null
      })
      .addCase(fetchDebtors.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload
      })
  }
})

export default agentOverviewSlice.reducer