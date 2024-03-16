
import { createSlice } from '@reduxjs/toolkit';
import { Shop } from "./activeShop";

const initialState: Shop[] | [] = []

const shopListDetailsSlice = createSlice({
  name: 'shopListDetails',
  initialState,
  reducers: {
    setShopListDetails: (state, action) => {      
      return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setShopListDetails } = shopListDetailsSlice.actions;

export default shopListDetailsSlice.reducer;
