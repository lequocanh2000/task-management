import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const statisticsApi = api.enhanceEndpoints({ addTagTypes: ["Statistics"] }).injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query({
      query: (year) => ({
        method: "GET",
        url: `${ApiUrls.getStatistics}?year=${year}`,
      }),
      providesTags: ["Statistics"],
    }),
    getStatisticsUsers: builder.query({
      query: (query) => ({
        method: "GET",
        url: `${ApiUrls.getStatisticsUsers}?year=${query.year}&department_id=${query.departmentId}&created_by=${query.createdBy}`,
      }),
      providesTags: ["Statistics"],
    }),
    getStatisticsByPosition: builder.query({
      query: (query) => ({
        method: "GET",
        url: `${ApiUrls.getStatisticsByPosition}?year=${query.year}&position_id=${query.positionId}&user_id=${query.userId}`,
      }),
      providesTags: ["Statistics"],
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

// export const pokemonApi = createApi({
//   reducerPath: "pokemonApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
//   endpoints: (builder) => ({
//     getPokemonByName: builder.query({
//       query: (name) => `pokemon/${name}`,
//     }),
//   }),
// });

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetStatisticsQuery,
  useLazyGetStatisticsQuery,
  useGetStatisticsUsersQuery,
  useLazyGetStatisticsUsersQuery,
  useGetStatisticsByPositionQuery,
  useLazyGetStatisticsByPositionQuery,
  util: { getRunningOperationPromises },
} = statisticsApi;
// export const { getGetUsers, getUserById, getUserByName } = statisticsApi.endpoints;
