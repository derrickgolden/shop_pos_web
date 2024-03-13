import { configureStore } from '@reduxjs/toolkit'
import userDetailsReducer from './userDetails'
import callApiReducer from './callApi'
import groupListReducer from './groupList'
import stockListReducer from './stockList'
import stockListDetailsReducer from './stockListDetails'
import salesReportReducer from './salesReport'
import rerenderReducer from './rerender'
import activeStockReducer from './activeShop'

export const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer, 
    callApi: callApiReducer,
    groupList: groupListReducer,
    stockList: stockListReducer,
    stockListDetailsList: stockListDetailsReducer,
    salesReport: salesReportReducer,
    rerender: rerenderReducer,
    activeStock: activeStockReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
