
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Shop {
    shop_id: number;
    user_id: number;
    shop_name: string;
    location: string;
    shop_email: string;
    shop_tel: string;
    logo_path: string | null;
    extra_info: string;
    reg_date: string; // This assumes the date is a string in ISO format (e.g., "2024-02-09T09:44:34.000Z")
}

export interface ShopState {
    shop: Shop | null;
}

const initialState: ShopState = {
    shop: null,
};

const activeShopSlice = createSlice({
  name: 'activeShop',
  initialState,
  reducers: {
    setActiveShop: (state, action: PayloadAction<ShopState>) => {
      return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setActiveShop } = activeShopSlice.actions;

export default activeShopSlice.reducer;

