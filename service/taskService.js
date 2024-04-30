import { acceptance } from "../model/acceptance.js";
import { task } from "../model/tasks.js";

async function inserttask(
  assignedBy,
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

async function getAdminTask() {
  return await task.find({ assignedBy });
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
async function updateTaskService(taskId, acceptanceStatus) {
  try {
    // console.log(taskId, acceptanceStatus);
    const result = await task.findOneAndUpdate(
      { _id: taskId },
      { acceptanceStatus }
    );
    // console.log(result);
    return result;
  } catch (error) {
    console.error("Error updating :", error);
    throw error;
  }
}

async function createAcceptedTask(taskId) {
  const { assigneeId, lastDate } = await task.findOne(
    { _id: taskId },
    { assigneeId: 1, lastDate: 1 }
  );
  return await acceptance.create({ taskId, assigneeId, lastDate });
}

export default {
  inserttask,
  getAdminTask,
  getUserTask,
  deleteTaskService,
  updateTaskService,
  createAcceptedTask,
};
