import { task } from "../model/tasks.js";

async function inserttask(
  assignedBy,
  assignedById,
  assignee,
  assigneeId,
  taskType,
  description,
  lastDate,
  priority
) {
  try {
    return await task.create({
      assignedBy,
      assignedById,
      assignee,
      assigneeId,
      taskType,
      description,
      lastDate,
      priority,
    });
  } catch (error) {
    console.error("Error inserting tasks:", error);
    return null;
  }
}

async function getAdminTask(assignedById) {
  return await task.find({ assignedById });
}
async function getUserTask(assigneeId) {
  return await task.find({ assigneeId });
}

async function deleteTaskService(taskId) {
  try {
    const result = await task.deleteOne({ _id: taskId });
    return result;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}
async function updateTaskService(taskId, taskStatus, assigneeId) {
  try {
    const result = await task.findOneAndUpdate(
      { _id: taskId, assigneeId: assigneeId },
      { taskStatus: taskStatus },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating :", error);
    throw error;
  }
}

async function getTask(querys, assigneeId) {
  const obj = { taskStatus: querys.taskStatus, assigneeId };
  return await task.find(obj);
}

async function checkStatus() {
  const tasks = await task.find({ taskStatus: { $ne: "closed" } });

  // Get today's date
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const tasksWithSameLastDate = tasks.filter((task) => {
    const taskLastDate = new Date(task.lastDate);
    const taskLastDateWithoutTime = new Date(
      taskLastDate.getFullYear(),
      taskLastDate.getMonth(),
      taskLastDate.getDate()
    );
    return taskLastDateWithoutTime.getTime() === todayDate.getTime();
  });
  return tasksWithSameLastDate;
}

async function updateToBacklogService(tasks) {
  return await task.findOneAndUpdate(
    { _id: tasks.id },
    { taskStatus: "backlog" },
    { new: true }
  );
}
export default {
  inserttask,
  getAdminTask,
  getUserTask,
  deleteTaskService,
  updateTaskService,
  getTask,
  checkStatus,
  updateToBacklogService,
};
