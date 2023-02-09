import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  descriptions: "",
  task_id: undefined,
  user_id: undefined,
  documentFiles: [],
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    addFile: (state, action) => {
      state.documentFiles.push(action.payload);
    },
    addTaskId: (state, action) => {
      state.task_id = action.payload;
    },
    addUserId: (state, action) => {
      state.user_id = action.payload;
    },
    addDescriptions: (state, action) => {
      state.descriptions = action.payload;
    },
    resetStoreDocument: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { addDescriptions, addFile, addTaskId, addUserId, resetStoreDocument } =
  documentSlice.actions;
export const selectDocument = (state) => state.document;
export default documentSlice.reducer;
