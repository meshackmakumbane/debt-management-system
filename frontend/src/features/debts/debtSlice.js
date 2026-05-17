

const initialState = {
  debts: [],
  installments: [],
  payments: [], 
  debtors: [],
  status: "idle",
  errorMessage: null
}

export const fetchDebts = createAsyncThunk(
  'data/fetchDebts',
  async (_, { rejectWithValue }) => {
    try{
      const { data } = await api.get('/users/debts')
      return data
    }catch(error){
      rejectWithValue(
        error.response?.data?.message || "Error fetching debts"
      )
    }
  }
)

export const fetchInstallments = createAsyncThunk(
  'data/fetchInstallments',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/installments')
      return data
    } catch (error) {
      rejectWithValue(
        error.response?.data?.message || "Error fetching installments"
      )
    }
  }
)

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

export const fetchPayments = createAsyncThunk(
  'data/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/installments')
      return data
    } catch (error) {
      rejectWithValue(
        error.response?.data?.message || "Error fetching installments"
      )
    }
  }
)

const dataSlice = createSlice({
  name: "data",
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

export default dataSlice.reducer