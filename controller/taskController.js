import { acceptance } from "../model/acceptance.js";
import taskService from "../service/taskService.js";
import userService from "../service/userService.js";

async function postTask(request, response) {
  try {
    const assignedBy = request.name.userName;
    const { assignee, taskType, description, lastDate, priority } =
      request.body;
    const assigneeId = await userService.getIdByName(assignee);
    response
      .status(201)
      .send(
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
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function getTask(request, response) {
  try {
    if (request.roleDetail.roleName == "admin") {
      response
        .status(200)
        .send(await taskService.getAdminTask(request.name.userName));
    } else if (request.roleDetail.roleName == "normal") {
      response
        .status(200)
        .send(await taskService.getUserTask(request.user.userId));
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function deleteTask(request, response) {
  try {
    if (request.roleDetail.roleName == "admin") {
      const { taskId } = request.body;
      response.status(200).send(await taskService.deleteTaskService(taskId));
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function updateTask(request, response) {
  try {
    const { taskId, acceptanceStatus } = request.body;
    if (await taskService.updateTaskService(taskId, acceptanceStatus)) {
      await taskService.createAcceptedTask(taskId);
    }
  } catch (err) {
    response.send(err.message);
  }
}

export default { postTask, getTask, deleteTask, updateTask };
