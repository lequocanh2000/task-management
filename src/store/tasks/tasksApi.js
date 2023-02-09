import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const tasksApi = api.enhanceEndpoints({ addTagTypes: ["Tasks"] }).injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => ({
        method: "GET",
        url: ApiUrls.getTasks,
        // url: ApiUrls.getTasks.replace("${name}", name),
      }),
      providesTags: ["Tasks"],
    }),
    getTasksHaveSubs: builder.query({
      query: () => ({
        method: "GET",
        url: ApiUrls.getTasksHaveSubs,
        // url: ApiUrls.getTasks.replace("${name}", name),
      }),
      providesTags: ["Tasks"],
    }),
    getSubsOfTask: builder.query({
      query: (id) => ({
        method: "GET",
        url: ApiUrls.getSubsOfTask.replace("${taskId}", id),
        // url: ApiUrls.getTasks.replace("${name}", name),
      }),
      providesTags: ["Tasks"],
    }),
    getDocumentAndCommentOfTask: builder.query({
      query: (taskId) => ({
        method: "GET",
        url: `${ApiUrls.getDocumentAndCommentOfTask}?task_id=${taskId}`,
        // url: ApiUrls.getTasks.replace("${name}", name),
      }),
      providesTags: ["Tasks"],
    }),
    getTaskById: builder.query({
      query: (id) => ({
        method: "GET",
        url: ApiUrls.getTaskById.replace("${taskId}", id),
        // url: ApiUrls.getTasks.replace("${name}", name),
      }),
      providesTags: ["Tasks"],
    }),
    getTaskByName: builder.query({
      query: (name) => ({
        method: "GET",
        url: ApiUrls.getTaskByName.replace("${name}", name),
        // url: ApiUrls.getTasks.replace("${name}", name),
      }),
      providesTags: ["Tasks"],
    }),
    getTasksParam: builder.query({
      query: ({ status, type }) => ({
        method: "GET",
        url: ApiUrls.getTasks,
        params: {
          status,
          type,
        },
      }),
      providesTags: ["Tasks"],
    }),
    getTaskParamTaskTypeId: builder.query({
      query: (taskTypeId) => ({
        method: "GET",
        url: ApiUrls.getTaskParamTaskTypeId.replace("${taskTypeId}", taskTypeId),
      }),
      providesTags: ["Tasks"],
    }),
    checkTasks: builder.query({
      query: () => ({
        method: "GET",
        url: ApiUrls.checkTasks,
      }),
      providesTags: ["Tasks"],
    }),
    addTask: builder.mutation({
      query: (body) => ({
        url: ApiUrls.addTask,
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: (body) => ({
        url: ApiUrls.updateTask.replace("${taskId}", body.id.toString()),
        method: "PUT",
        body: { ...body },
      }),
      invalidatesTags: ["Tasks"],
    }),
    updatePausedTask: builder.mutation({
      query: (body) => ({
        url: ApiUrls.updatePausedTask.replace("${taskId}", body.id.toString()),
        method: "PUT",
        body: { ...body },
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: ApiUrls.deleteTask.replace("${taskId}", id.toString()),
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
  overrideExisting: false,
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTasksQuery,
  useLazyGetTasksQuery,
  useGetTasksHaveSubsQuery,
  useLazyGetTasksHaveSubsQuery,
  useGetSubsOfTaskQuery,
  useLazyGetSubsOfTaskQuery,
  useGetDocumentAndCommentOfTaskQuery,
  useLazyGetDocumentAndCommentOfTaskQuery,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
  useGetTaskByNameQuery,
  useGetTasksParamQuery,
  useGetTaskParamTaskTypeIdQuery,
  useLazyGetTaskParamTaskTypeIdQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useUpdatePausedTaskMutation,
  useDeleteTaskMutation,
  useCheckTasksQuery,
  useLazyCheckTasksQuery,
} = tasksApi;
export const { addTask, updateTask, deleteTask, updatePausedTask } = tasksApi.endpoints;
