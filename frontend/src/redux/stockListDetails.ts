
import { createSlice } from '@reduxjs/toolkit';

const shopListDetailsSlice = createSlice({
  name: 'shopListDetails',
  initialState: [],
  reducers: {
    setShopListDetails: (state, action) => {      
      return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setShopListDetails } = shopListDetailsSlice.actions;

export default shopListDetailsSlice.reducer;
