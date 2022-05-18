import { createSlice } from '@reduxjs/toolkit';
export interface page {
  asPath: string;
}

const initialState: page = {
  asPath: '',
};

export const PageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    handleRoutePage: (state: page, action: any) => {
      const asPath = action.payload;
      return {
        ...state,
        asPath: asPath,
      };
    },
  },
});

export const { handleRoutePage } = PageSlice.actions;

export const namespace = 'PageSlice';

export default PageSlice.reducer;
