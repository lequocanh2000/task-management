import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const taskTypesApi = api.enhanceEndpoints({ addTagTypes: ["TaskTypes"] }).injectEndpoints({
  endpoints: (builder) => ({
    getTaskTypes: builder.query({
      query: () => ({
        method: "GET",
        url: ApiUrls.getTaskTypes,
      }),
      providesTags: ["TaskTypes"],
    }),
    getTaskTypeId: builder.query({
      query: (id) => ({
        method: "GET",
        url: ApiUrls.getTaskTypeId.replace("${taskTypeId}", id),
      }),
      providesTags: ["TaskTypes"],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTaskTypesQuery } = taskTypesApi;
// export const { getGetTaskTypes, getUserById, getUserByName } = taskTypes.endpoints;
