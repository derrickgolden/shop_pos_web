import { createSlice } from '@reduxjs/toolkit';

const callApiSlice = createSlice({
  name: 'callApi',
  initialState: false,
  reducers: {
    setCallApi: (state, action) => {
        return !state
    }
  }  
});

// Action creators for signup details
export const { setCallApi } = callApiSlice.actions;

export default callApiSlice.reducer;
