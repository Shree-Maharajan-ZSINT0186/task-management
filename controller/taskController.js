import { acceptance } from "../model/acceptance.js";
import taskService from "../service/taskService.js";
import userService from "../service/userService.js";

async function postTask(request, response) {
  const assignedBy = request.name.userName;

  const { assignee, taskType, description, lastDate, priority } = request.body;
  const assigneeId = await userService.getIdByName(assignee);
  response.send(
    await taskService.inserttask(
      assignedBy,
      assignee,
      assigneeId.id,
      taskType,
      description,
      lastDate,
      priority
    )
  );
}

async function getTask(request, response) {
  if (request.roleDetail.roleName == "admin") {
    response.send(await taskService.getAdminTask(request.name.userName));
  } else {
    response.send(await taskService.getUserTask(request.user.userId));
  }
}

async function deleteTask(request, response) {
  if (request.roleDetail.roleName == "admin") {
    const { taskId } = request.body;
    console.log(taskId);
    response.send(await taskService.deleteTaskService(taskId));
  }
}

async function updateTask(request, response) {
  const { taskId, acceptanceStatus } = request.body;
  if (await taskService.updateTaskService(taskId, acceptanceStatus)) {
    await taskService.createAcceptedTask(taskId);
  }
}

export default { postTask, getTask, deleteTask, updateTask };
