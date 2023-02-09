// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

// Define our single API slice object
export const initApi = createApi({
  baseQuery: fetchBaseQuery({
    // All of our requests will have URLs starting with '/api'
    baseUrl: `${process.env.baseUrl}`,
    // The second parameter allows us to access the state.
    prepareHeaders: (headers) => {
      // headers.set(Headers.Authorization, `Bearer ${token}`);

      headers.set("accept", "application/json");
      return headers;
    },
  }),
  reducerPath: "api",
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ["Users", "Tasks", "TaskTypes", "Documents", "Comments", "Departments"],
  // The "endpoints" represent operations and requests for this server
  endpoints: () => ({}),
});
