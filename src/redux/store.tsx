// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import userReducer from './userSlice'
export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    user:userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
