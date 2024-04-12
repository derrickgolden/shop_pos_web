import { configureStore } from '@reduxjs/toolkit'
import userDetailsReducer from './userDetails'
import callApiReducer from './callApi'
import groupListReducer from './groupList'
import productListReducer from './productList'
import shopListDetailsReducer from './shopListDetails'
import salesReportReducer from './salesReport'
import rerenderReducer from './rerender'
import activeShopReducer from './activeShop'
import paymentDetailsReducer from './paymentDetails'

export const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer, 
    callApi: callApiReducer,
    groupList: groupListReducer,
    productList: productListReducer,
    shopListDetailsList: shopListDetailsReducer,
    salesReport: salesReportReducer,
    rerender: rerenderReducer,
    activeShop: activeShopReducer,
    paymentDetails: paymentDetailsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
