import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/services/authSlice'
import overviewReducer from '../features/service/overviewSlice'
import settingReducer from '../features/service/settingSlice'
import debtReducer from '../features/service/debtSlice'
import installmentReducer from '../features/service/installmentSlice'
import paymentReducer from '../features/service/paymentSlice'
import debtorReducer from '../features/service/debtorSlice'

const store = configureStore({
  reducer:{
    auth: authReducer,
    overview: overviewReducer,
    setting: settingReducer,
    debt: debtReducer,                    /* ---- DEBTS (ROLE-BASED) ----------- */
    installment : installmentReducer,     /* ---- INSTALLMENTS (ROLE-BASED) ---- */
    payment : paymentReducer,             /* ---- PAYMENT (ROLE-BASED) --------- */
    debtor : debtorReducer,               /* ---- DEBTORS (ROLE-BASED) --------- */
  }
}) 

export default store