import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const reportsApi = api.enhanceEndpoints({ addTagTypes: ["Reports"] }).injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (query) => ({
        method: "GET",
        url: `${ApiUrls.getReports}?year=${query.year}&userId=${query.userId}`,
      }),
      providesTags: ["Reports"],
    }),
    getReportsUsers: builder.query({
      query: (query) => ({
        method: "GET",
        url: `${ApiUrls.getReportsUsers}?year=${query.year}&department_id=${query.departmentId}&user_id=${query.userId}`,
      }),
      providesTags: ["Reports"],
    }),
    // getUserById: builder.query({
    //   query: (id) => ({
    //     method: "GET",
    //     url: ApiUrls.getUserById.replace("${userId}", id),
    //     // url: ApiUrls.getUsers.replace("${name}", name),
    //   }),
    //   providesTags: ["Users"],
    // }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetReportsQuery,
  useGetReportsQuery,
  useGetReportsUsersQuery,
  useLazyGetReportsUsersQuery,
  util: { getRunningOperationPromises },
} = reportsApi;
// export const { getGetUsers, getUserById, getUserByName } = statisticsApi.endpoints;
