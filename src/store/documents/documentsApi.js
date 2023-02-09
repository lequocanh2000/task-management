import { initApi as api } from "@/store/initApi";
import { ApiUrls } from "@/store/apiUrls";
// Define a service using a base URL and expected endpoints

export const documentsApi = api.enhanceEndpoints({ addTagTypes: ["Documents"] }).injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: () => ({
        method: "GET",
        url: ApiUrls.getDocuments,
      }),
      providesTags: ["Documents"],
    }),
    getDocumentById: builder.query({
      query: (id) => ({
        method: "GET",
        url: ApiUrls.getDocumentById.replace("${documentId}", id),
      }),
      providesTags: ["Documents"],
    }),
    getDocumentsOfTask: builder.query({
      query: (taskId) => ({
        method: "GET",
        url: ApiUrls.getDocumentsOfTask.replace("${taskId}", taskId),
      }),
      providesTags: ["Documents"],
    }),
    // getDocumentByName: builder.query({
    //   query: (name) => ({
    //     method: "GET",
    //     url: ApiUrls.getDocumentByName.replace("${name}", name),
    //     // url: ApiUrls.getDocuments.replace("${name}", name),
    //   }),
    //   providesTags: ["Documents"],
    // }),
    // getUserParam: builder.query({
    //   query: (param) => ({
    //     method: "GET",
    //     url: ApiUrls.getUserByName.replace("${name}", name),
    //     params: param,
    //   }),
    //   providesTags: ["Documents"],
    // }),
    addDocument: builder.mutation({
      query: (body) => ({
        url: ApiUrls.addDocument,
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Documents"],
    }),
    addFilesToDrive: builder.mutation({
      query: (body) => ({
        url: ApiUrls.addFilesToDrive,
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Documents"],
    }),
    // updateEnterprise: builder.mutation({
    //   query: (body) => ({
    //     url: ApiUrls.updateEnterprise.replace("${enterpriseId}", body.enterpriseId.toString()),
    //     method: "PUT",
    //     body: { ...body.enterprise },
    //   }),
    //   invalidatesTags: ["Documents"],
    // }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: ApiUrls.deleteDocument.replace("${documentId}", id),
      }),
      invalidatesTags: ["Documents"],
    }),
  }),
  overrideExisting: false,
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useGetDocumentsOfTaskQuery,
  useAddDocumentMutation,
  useAddFilesToDriveMutation,
  useDeleteDocumentMutation,
} = documentsApi;
export const { addDocument, addFilesToDrive, deleteDocument } = documentsApi.endpoints;
