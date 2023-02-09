import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const commentsApi = api.enhanceEndpoints({ addTagTypes: ["Comments"] }).injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: () => ({
        method: "GET",
        url: ApiUrls.getComments,
      }),
      providesTags: ["Comments"],
    }),
    getCommentById: builder.query({
      query: (id) => ({
        method: "GET",
        url: ApiUrls.getCommentById.replace("${commentId}", id),
      }),
      providesTags: ["Comments"],
    }),
    getCommentsOfTask: builder.query({
      query: (taskId) => ({
        method: "GET",
        url: ApiUrls.getCommentsOfTask.replace("${taskId}", taskId),
      }),
      providesTags: ["Comments"],
    }),
    // getCommentByName: builder.query({
    //   query: (name) => ({
    //     method: "GET",
    //     url: ApiUrls.getCommentByName.replace("${name}", name),
    //     // url: ApiUrls.getComments.replace("${name}", name),
    //   }),
    //   providesTags: ["Comments"],
    // }),
    // getUserParam: builder.query({
    //   query: (param) => ({
    //     method: "GET",
    //     url: ApiUrls.getUserByName.replace("${name}", name),
    //     params: param,
    //   }),
    //   providesTags: ["Comments"],
    // }),
    addComment: builder.mutation({
      query: (body) => ({
        url: ApiUrls.addComment,
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Comments"],
    }),
    updateComment: builder.mutation({
      query: (body) => ({
        url: ApiUrls.updateComment.replace("${commentId}", body.id.toString()),
        method: "PUT",
        body: { ...body },
      }),
      invalidatesTags: ["Comments"],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: ApiUrls.deleteComment.replace("${commentId}", id),
      }),
      invalidatesTags: ["Comments"],
    }),
  }),
  overrideExisting: false,
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCommentsQuery,
  useGetCommentByIdQuery,
  useGetCommentsOfTaskQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLazyGetCommentsQuery,
  useLazyGetCommentByIdQuery,
  useLazyGetCommentsOfTaskQuery,
  // useGetCommentsQuery,
  // useGetCommentByIdQuery,
  // useGetCommentsOfTaskQuery,
  // useAddCommentMutation,
  // useDeleteCommentMutation,
} = commentsApi;
export const { addComment, updateComment, deleteComment } = commentsApi.endpoints;
