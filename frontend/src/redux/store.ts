import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { productApi } from './api/productApi';
import { orderApi } from './api/orderApi';
import { dashboardApi } from './api/dashboardApi';
import { profileApi } from './api/profileApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(orderApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(profileApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;