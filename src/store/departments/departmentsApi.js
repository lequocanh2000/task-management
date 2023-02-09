import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const departmentsApi = api
  .enhanceEndpoints({ addTagTypes: ["Departments"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getDepartments: builder.query({
        query: () => ({
          method: "GET",
          url: ApiUrls.getDepartments,
        }),
        providesTags: ["Departments"],
      }),
    }),
    overrideExisting: false,
  });

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDepartmentsQuery, useLazyGetDepartmentsQuery } = departmentsApi;
// export const { getGetTaskTypes, getUserById, getUserByName } = taskTypes.endpoints;
