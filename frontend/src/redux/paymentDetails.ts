import { createSlice } from '@reduxjs/toolkit';

export interface PaymentDetailProps {
    payment_detail_id: number;
    payment_name: string;
    details: {
        [key: string]: string; // This allows any string key with string values
    };
    shop_id: number;
};

const initialState: PaymentDetailProps[] = [];

const paymentDetailsSlice = createSlice({
  name: 'paymentDetails',
  initialState,
  reducers: {
    setPaymentDetails: (state, action) => {      
        return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setPaymentDetails } = paymentDetailsSlice.actions;

export default paymentDetailsSlice.reducer;
