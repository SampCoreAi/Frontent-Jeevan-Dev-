import { configureStore } from '@reduxjs/toolkit';

import userProfileReducer from './slices/userProfileSlice';

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
});

