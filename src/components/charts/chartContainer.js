export const handleSetStatistics = (commitmentPoints, completePoints, inCompletePoints) => {
  const statistics = [];
  commitmentPoints.forEach((commitmentPoint) => {
    const complete = completePoints.find((complete) => commitmentPoint.month == complete.month);
    const inComplete = inCompletePoints.find(
      (inComplete) => commitmentPoint.month == inComplete.month
    );

    if (complete && inComplete) {
      statistics.push({
        month: commitmentPoint.month,
        year: commitmentPoint.year,
        commitment_point: Number(commitmentPoint.commitment_point),
        complete_point: Number(complete.complete_point),
        incomplete_point: Number(inComplete.incomplete_point),
      });
      return;
    }

    if (complete && !inComplete) {
      statistics.push({
        month: commitmentPoint.month,
        year: commitmentPoint.year,
        commitment_point: Number(commitmentPoint.commitment_point),
        complete_point: Number(complete.complete_point),
        incomplete_point: 0,
      });
      return;
    }

    if (!complete && inComplete) {
      statistics.push({
        month: commitmentPoint.month,
        year: commitmentPoint.year,
        commitment_point: Number(commitmentPoint.commitment_point),
        complete_point: 0,
        incomplete_point: Number(inComplete.incomplete_point),
      });
      return;
    }
  });
  return statistics;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const handleSetReports = (taskCompleteds, taskFaileds, year) => {
  const reports = [];
  months.forEach((month) => {
    const taskCompleted = taskCompleteds.find((taskCompleted) => taskCompleted.month == month);
    const taskFailed = taskFaileds.find((taskFailed) => taskFailed.month == month);

    if (taskCompleted && !taskFailed) {
      reports.push({
        month,
        year,
        task_completed: taskCompleted.task_completed,
        task_failed: 0,
        // task_completed: Number(commitmentPoint.commitment_point),
        // task_failed: Number(complete.complete_point),
      });
      return;
    }

    if (!taskCompleted && taskFailed) {
      reports.push({
        month,
        year,
        task_completed: 0,
        task_failed: taskFailed.task_failed,
        // task_completed: Number(commitmentPoint.commitment_point),
        // task_failed: Number(complete.complete_point),
      });
      return;
    }

    if (taskCompleted && taskFailed) {
      reports.push({
        month,
        year,
        task_completed: taskCompleted.task_completed,
        task_failed: taskFailed.task_failed,
      });
      return;
    } else {
      reports.push({
        month,
        year,
        task_completed: 0,
        task_failed: 0,
      });
      return;
    }
  });
  return reports;
};
