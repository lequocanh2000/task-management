import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const notificationsApi = api
  .enhanceEndpoints({ addTagTypes: ["Notifications"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getNotifications: builder.query({
        query: () => ({
          method: "GET",
          url: ApiUrls.getNotifications,
        }),
        providesTags: ["Notifications"],
      }),
      getNotificationById: builder.query({
        query: (id) => ({
          method: "GET",
          url: ApiUrls.getNotificationById.replace("${notificationId}", id),
        }),
        providesTags: ["Notifications"],
      }),
      getNotificationsOfUser: builder.query({
        query: (userId) => ({
          method: "GET",
          url: ApiUrls.getNotificationsOfUser.replace("${userId}", userId),
        }),
        providesTags: ["Notifications"],
      }),
      addNotification: builder.mutation({
        query: (body) => ({
          url: ApiUrls.addNotification,
          method: "POST",
          body: { ...body },
        }),
        invalidatesTags: ["Notifications"],
      }),
      updateNotification: builder.mutation({
        query: (body) => ({
          url: ApiUrls.updateNotification.replace("${notificationId}", body.id.toString()),
          method: "PUT",
          body: { ...body },
        }),
        invalidatesTags: ["Notifications"],
      }),
      deleteNotification: builder.mutation({
        query: (id) => ({
          method: "DELETE",
          url: ApiUrls.deleteNotification.replace("${notificationId}", id),
        }),
        invalidatesTags: ["Notifications"],
      }),
    }),
    overrideExisting: false,
  });
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useGetNotificationsOfUserQuery,
  useAddNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useLazyGetNotificationsQuery,
  useLazyGetNotificationByIdQuery,
  useLazyGetNotificationsOfUserQuery,
} = notificationsApi;
export const { addNotification, updateNotification, deleteNotification } =
  notificationsApi.endpoints;
