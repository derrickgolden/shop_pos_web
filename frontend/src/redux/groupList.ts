import { createSlice } from '@reduxjs/toolkit';
import { ProductDetails } from '../user/sections/pointOfEntry/types';

export interface Group {
  group_id: number;
  group_name: string;
  description: string;
  products: ProductDetails[];
}

const initialState: Group[] = [];

const groupListSlice = createSlice({
  name: 'groupList',
  initialState,
  reducers: {
    setGroupList: (state, action) => {
        return action.payload;
    }
  }  
});

// Action creators for signup details
export const { setGroupList } = groupListSlice.actions;

export default groupListSlice.reducer;
