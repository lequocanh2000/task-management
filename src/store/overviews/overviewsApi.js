import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const overviewsApi = api.enhanceEndpoints({ addTagTypes: ["Overviews"] }).injectEndpoints({
  endpoints: (builder) => ({
    getOverviews: builder.query({
      query: (query) => ({
        method: "GET",
        url: `${ApiUrls.getOverviews}?user_id=${query.userId}&department_id=${query.departmentId}`,
      }),
      providesTags: ["Overviews"],
    }),
    // getUserById: builder.query({
    //   query: (id) => ({
    //     method: "GET",
    //     url: ApiUrls.getUserById.replace("${userId}", id),
    //     // url: ApiUrls.getUsers.replace("${name}", name),
    //   }),
    //   providesTags: ["Users"],
    // }),
    // getUserByName: builder.query({
    //   query: (name) => ({
    //     method: "GET",
    //     url: ApiUrls.getUserByName.replace("${name}", name),
    //     // url: ApiUrls.getUsers.replace("${name}", name),
    //   }),
    //   providesTags: ["Users"],
    // }),
    // getLogin: builder.query({
    //   query: (query) => ({
    //     method: "GET",
    //     url: `${ApiUrls.getUsers}?email=${query.email}&password=${query.password}`,
    //   }),
    //   providesTags: ["Users"],
    // }),
    // addUsers: builder.mutation({
    //   query: (body) => ({
    //     url: ApiUrls.addUsers,
    //     method: "POST",
    //     body: { ...body },
    //   }),
    //   invalidatesTags: ["Users"],
    // }),
    // updateUsers: builder.mutation({
    //   query: (body) => ({
    //     url: ApiUrls.updateUser.replace("${usersId}", body.usersId.toString()),
    //     method: "PUT",
    //     body: { ...body},
    //   }),
    //   invalidatesTags: ["Userss"],
    // }),
    // deleteUser: builder.mutation({
    //   query: (queryArg) => ({
    //     url: ApiUrls.deleteUser.replace("${usersId}", queryArg.usersId.toString()),
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Users"],
    // }),
  }),
  overrideExisting: false,
});

export const {
  useLazyGetOverviewsQuery,
  util: { getRunningOperationPromises },
} = overviewsApi;
// export const { getGetUsers, getUserById, getUserByName } = statisticsApi.endpoints;
