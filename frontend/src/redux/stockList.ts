import { createSlice } from '@reduxjs/toolkit';

const stockListSlice = createSlice({
  name: 'stockList',
  initialState: [],
  reducers: {
    setStockList: (state, action) => {      
        return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setStockList } = stockListSlice.actions;

export default stockListSlice.reducer;
