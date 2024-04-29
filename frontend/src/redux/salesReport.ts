import { createSlice } from '@reduxjs/toolkit';
import { SalesItemApiData, SharedSalesProps } from '../user/components/reports/types';

export interface SalesApiData extends SharedSalesProps{
  sales_items: SalesItemApiData[]; 
}

const initialState: SalesApiData[] = [];

const salesReportSlice = createSlice({
  name: 'salesReport',
  initialState,
  reducers: {
    setSalesReportList: (state, action) => {      
        return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setSalesReportList } = salesReportSlice.actions;

export default salesReportSlice.reducer;
