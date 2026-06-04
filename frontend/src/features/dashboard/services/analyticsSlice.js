import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../../api/axios'

const initialState = {
  results: null,
  loading: false,
  error: null
} 

export const fetchAnalytics = createAsyncThunk(
  'results/fetchAnalytics',
  async(_, {rejectWithValue}) => {
    try{

    }catch(error){
      return rejectWithValue
    }
  }
)