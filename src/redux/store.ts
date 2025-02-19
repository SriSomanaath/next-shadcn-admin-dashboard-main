import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import utmReducer from "./slices/utmSlice"; // Import UTM slice
import { leadManagementApi } from "./services/leadManagementServices";
import { urmTrackerServiceApi } from "./services/utmTrackerServices";
import { MessagesApi } from "./services/MessagesServices";
import { leadqaApi } from "./services/leadqaServices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    utm: utmReducer,
    [MessagesApi.reducerPath]: MessagesApi.reducer,
    [leadqaApi.reducerPath]: leadqaApi.reducer,
    [leadManagementApi.reducerPath]: leadManagementApi.reducer,
    [urmTrackerServiceApi.reducerPath]: urmTrackerServiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      leadManagementApi.middleware, 
      urmTrackerServiceApi.middleware,
      MessagesApi.middleware,
      leadqaApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
