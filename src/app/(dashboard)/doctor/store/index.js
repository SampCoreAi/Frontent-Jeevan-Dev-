import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer from './scheduleSlice';

import profileReducer from './profileSlice';

// Configure Redux store
const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
