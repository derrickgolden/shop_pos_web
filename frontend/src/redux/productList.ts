import { createSlice } from '@reduxjs/toolkit';

const productListSlice = createSlice({
  name: 'productList',
  initialState: [],
  reducers: {
    setProductList: (state, action) => {      
        return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setProductList } = productListSlice.actions;

export default productListSlice.reducer;
