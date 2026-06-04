import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../api/axios'

const initialState = {
  data: [],
  counts: null,
  organization: null,
  loading: false,
  error: null
} 

export const fetchData = createAsyncThunk(
  'agent/fetchData',
  async(_, {rejectWithValue})=>{ 
    try{
      const { data } = await api.get('/overview/data')
      return data
    }catch(err){
      rejectWithValue(err.response?.data?.message || "Error fetching data")
    }
  }
)

export const overviewSlice = createSlice({
  name:'overview',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder
      //Fetch all debts
      .addCase(fetchData.pending, (state)=>{
        state.loading = true
        state.erroe = null
      })
      .addCase(fetchData.fulfilled, (state, action)=>{
        state.loading = false
        state.data = action.payload.data
        state.counts = action.payload.counts
        state.organization = action.payload.organization
        state.error = null
      })
      .addCase(fetchData.rejected, (state, action)=>{
        state.loading = false
        state.error = action.payload
      })
  }
})

export default overviewSlice.reducer