import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { usersApi } from "@/store/users/usersApi";
import { tasksApi } from "@/store/tasks/tasksApi";
import { taskTypesApi } from "@/store/taskTypes/taskTypesApi";
import { documentsApi } from "@/store/documents/documentsApi";
import { departmentsApi } from "@/store/departments/departmentsApi";
import { commentsApi } from "@/store/comments/commentsApi";
import { notificationsApi } from "@/store/notifications/notificationsApi";
import { statisticsApi } from "@/store/statistics/statisticsApi";
import { reportsApi } from "@/store/reports/reportsApi";
import { overviewsApi } from "@/store/overviews/overviewsApi";

import { initApi as api } from "@/store/initApi";
import documentSlice from "@/store/documents/documentSlice";
import tasksSlice from "@/store/tasks/tasksSlice";
import reportsSlice from "@/store/reports/reportsSlice";

const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    document: documentSlice,
    tasks: tasksSlice,
    reports: reportsSlice,
    [api.reducerPath]: api.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [taskTypesApi.reducerPath]: taskTypesApi.reducer,
    [documentsApi.reducerPath]: documentsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [overviewsApi.reducerPath]: overviewsApi.reducer,
    [departmentsApi.reducerPath]: departmentsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
      usersApi.middleware,
      tasksApi.middleware,
      taskTypesApi.middleware,
      documentsApi.middleware,
      commentsApi.middleware,
      notificationsApi.middleware,
      statisticsApi.middleware,
      reportsApi.middleware,
      overviewsApi.middleware,
      departmentsApi.middleware,
    ]),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
export default store;
