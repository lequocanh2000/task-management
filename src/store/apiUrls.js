export const ApiUrls = {
  getPokemonByName: "pokemon/${name}",
  getUsers: "/users",
  getUserById: "/users/${userId}",
  getUserByName: "/users?name=${name}",
  getLogin: "/users/login",
  getUsersWithDepartments: "/users/users-departments",
  //task
  getTasks: "/tasks",
  getTasksHaveSubs: "/tasks/tasks-subs",
  getSubsOfTask: "/tasks/${taskId}/sub-tasks",
  getDocumentAndCommentOfTask: "/tasks/task-document-comment",
  getTaskById: "/tasks/${taskId}",
  getTaskByName: "/tasks?name=${name}",
  getTaskParamTaskTypeId: "/tasks?task_type_id=${taskTypeId}",
  checkTasks: "/tasks/check-tasks",
  addTask: "/tasks",
  updateTask: "/tasks/${taskId}",
  updatePausedTask: "/tasks/${taskId}/paused",
  deleteTask: "/tasks/${taskId}",
  //task types
  getTaskTypes: "/task-types",
  getTaskTypeId: "/task-types/${taskTypeId}",
  //departments
  getDepartments: "/departments",
  //documents
  getDocuments: "/documents",
  getDocumentById: "/documents/${documentId}",
  getDocumentsOfTask: "/documents/${taskId}/task-documents",
  addDocument: "/documents",
  addFilesToDrive:
    "https://script.google.com/macros/s/AKfycbwlRaY_Uiuby8iHRDgoTR8fP16mg2-X9iGxe_f8kQXUawOgVPCtfMPpPeXgWLxeszPesQ/exec",
  deleteDocument: "/documents/${documentId}",
  //comments
  getComments: "/comments",
  getCommentById: "/comments/${commentId}",
  getCommentsOfTask: "/comments/${taskId}/task-comments",
  addComment: "/comments",
  updateComment: "/comments/${commentId}",
  deleteComment: "/comments/${commentId}",
  //Notifications
  getNotifications: "/notifications",
  getNotificationById: "/notifications/${notificationId}",
  getNotificationsOfUser: "/notifications/${userId}/user-notifications",
  addNotification: "/notifications",
  updateNotification: "/notifications/${notificationId}",
  deleteNotification: "/notifications/${notificationId}",
  //statistics
  getStatistics: "/statistics",
  getStatisticsUsers: "/statistics/statistics-users",
  getStatisticsByPosition: "/statistics/statistics-position",
  //reports
  getReports: "/reports",
  getReportsUsers: "/reports/report-users",
  //overviews
  getOverviews: "/overviews",
};
