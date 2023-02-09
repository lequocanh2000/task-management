import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filter: {
    type: "all",
    search: "",
  },
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = [...action.payload];
    },
    setFilterSearch: (state, action) => {
      state.filter.search = action.payload;
    },
    setFilterType: (state, action) => {
      state.filter.type = action.payload;
    },
    // addUserId: (state, action) => {
    //   state.user_id = action.payload;
    // },
    // addDescriptions: (state, action) => {
    //   state.descriptions = action.payload;
    // },
    // resetStoreDocument: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { setTasks, setFilterSearch, setFilterType } = tasksSlice.actions;
// export const selectTasks = (state) => state.tasks.tasks;
export const selectFilterSearch = (state) => state.tasks.filter.search;
export const selectFilterType = (state) => state.tasks.filter.type;
export const selectFilterPaused = (state) => state.tasks.filter.paused;

export const selectTasks = (state) => {
  if (selectFilterType(state) == "all") {
    const filterSearch = state.tasks.tasks.filter((task) => {
      return (
        task.task_name.toLowerCase().includes(selectFilterSearch(state).toLowerCase()) &&
        task.paused != 1
      );
    });
    return filterSearch;
  }

  if (selectFilterType(state) == "paused") {
    const filterPaused = state.tasks.tasks.filter((task) => {
      return (
        task.paused == 1 &&
        task.task_name.toLowerCase().includes(selectFilterSearch(state).toLowerCase())
      );
    });
    return filterPaused;
  }

  const filterTasksSearchType = state.tasks.tasks.filter((task) => {
    return (
      task.task_name.toLowerCase().includes(selectFilterSearch(state).toLowerCase()) &&
      task.task_type_id == selectFilterType(state) &&
      task.paused != 1
    );
  });
  return filterTasksSearchType;
};

export default tasksSlice.reducer;
