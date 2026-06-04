import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import overviewReducer from '../features/dashboard/services/overviewSlice'
// import settingReducer from '../features/service/settingSlice'
import debtReducer from '../features/dashboard/services/debtSlice'
import installmentReducer from '../features/dashboard/services/installmentSlice'
import paymentReducer from '../features/dashboard/services/paymentSlice'
import debtorReducer from '../features/dashboard/services/debtorSlice'

const store = configureStore({
  reducer:{
    auth: authReducer,
    overview: overviewReducer,
    debt: debtReducer,                    /* ---- DEBTS (ROLE-BASED) ----------- */
    installment : installmentReducer,     /* ---- INSTALLMENTS (ROLE-BASED) ---- */
    payment : paymentReducer,             /* ---- PAYMENT (ROLE-BASED) --------- */
    debtor : debtorReducer,               /* ---- DEBTORS (ROLE-BASED) --------- */
    // setting: settingReducer,
  }
}) 

export default store