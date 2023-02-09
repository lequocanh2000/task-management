import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterMonth: "",
  tasks: [],
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = [...action.payload];
    },
    setFilterMonth: (state, action) => {
      state.filterMonth = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTasks, setFilterMonth } = reportsSlice.actions;

// export const selectReportTasks = (state) => state.reports.tasks;
export const selectFilterMonth = (state) => state.reports.filterMonth;
export const selectReportTasks = (state) => {
  if (selectFilterMonth(state) != "all") {
    const tasks = state.reports.tasks.filter((task) => {
      const createdAt = new Date(task.created_at);
      const month = createdAt.getMonth() + 1;
      return month == selectFilterMonth(state);
    });
    return tasks;
  }
  return state.reports.tasks;
};

export default reportsSlice.reducer;
