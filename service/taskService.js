import { task } from "../model/tasks.js";

async function insertTask(
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

// async function getAdminTask(assignedById) {
//   return await task.find({ assignedById });
// }
// async function getUserTask(assigneeId) {
//   return await task.find({ assigneeId });
// }

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

async function updateToBacklogService(tasks) {
  return await task.findOneAndUpdate(
    { _id: tasks.id },
    { taskStatus: "backlog" },
    { new: true }
  );
}

// async function updateTaskService(...args) {
//   try {
//     console.log(args);
//     let updateData = { taskStatus: taskStatus };
//     if (taskStatus === "backlog") {
//       updateData = { taskStatus: "backlog" };
//     }
//     const result = await task.findOneAndUpdate(
//       { _id: taskId, assigneeId: assigneeId },
//       updateData,
//       { new: true }
//     );
//     return result;
//   } catch (error) {
//     console.error("Error updating :", error);
//     throw error;
//   }
// }

async function getUserTask(searchQuery, assigneeId, skip, limit) {
  const obj = searchQuery ? { ...searchQuery, assigneeId } : { assigneeId };
  const tasks = await task.find(obj).skip(skip).limit(limit);
  const count = await task.countDocuments(obj);

  return { count, data: tasks };
}

async function getAdminTask(searchQuery, assignedById, skip, limit) {
  const obj = searchQuery ? { ...searchQuery, assignedById } : { assignedById };
  const tasks = await task.find(obj).skip(skip).limit(limit);
  const count = await task.countDocuments(obj);

  return { count, data: tasks };
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
    // console.log(
    //   taskLastDateWithoutTime.getTime() + "    " + todayDate.getTime()
    // );
    return taskLastDateWithoutTime.getTime() === todayDate.getTime();
  });
  return tasksWithSameLastDate;
}

export default {
  insertTask,
  getAdminTask,
  getUserTask,
  deleteTaskService,
  updateTaskService,

  checkStatus,
  updateToBacklogService,
};
