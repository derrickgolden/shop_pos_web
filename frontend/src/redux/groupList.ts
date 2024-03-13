import { createSlice } from '@reduxjs/toolkit';
import { StockDetails } from '../user/sections/pointOfEntry/types';

export interface Group {
  group_id: number;
  group_name: string;
  description: string;
  stock: StockDetails[];
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
