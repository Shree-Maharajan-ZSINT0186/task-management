import taskService from "../service/taskService.js";
import userService from "../service/userService.js";

async function postTask(request, response) {
  try {
    if (request.roleDetail.roleName == "admin") {
      const assignedBy = request.name.userName;
      const assignedById = request.id;
      const { assignee, taskType, description, lastDate, priority } =
        request.body;
      const assigneeId = await userService.getIdByName(assignee);
      response
        .status(201)
        .send(
          await taskService.inserttask(
            assignedBy,
            assignedById,
            assignee,
            assigneeId.id,
            taskType,
            description,
            lastDate,
            priority
          )
        );
    } else {
      response.status(403).send({ msg: " cannot access " });
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function getTask(request, response) {
  try {
    const querys = request.query;

    if (request.roleDetail.roleName == "admin") {
      if ("taskStatus" in querys) {
        response.send(await taskService.getTask(querys));
      } else {
        response.status(200).send(await taskService.getAdminTask(request.id));
      }
    } else if (request.roleDetail.roleName == "normal") {
      if ("taskStatus" in querys) {
        // console.log(querys);
        response.send(await taskService.getTask(querys, request.id));
      } else {
        response.status(200).send(await taskService.getUserTask(request.id));
      }
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
    const { taskId, taskStatus } = request.body;

    const Taskexist = await taskService.updateTaskService(
      taskId,
      taskStatus,
      request.id
    );
    // console.log(Taskexist);
    response.send(Taskexist ? Taskexist : { msg: "cannot update" });
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function updateToBacklog(request, response) {
  try {
    const tasks = await taskService.checkStatus();
    if (tasks) {
      for (const task of tasks) {
        await taskService.updateToBacklogService(task);
      }
    }
    response.send({ msg: "Tasks updated to backlog" });
  } catch (error) {
    console.log(error.message);
    // response.status(500).send({ error: "Internal server error" });
  }
}

export default { postTask, getTask, deleteTask, updateTask, updateToBacklog };
