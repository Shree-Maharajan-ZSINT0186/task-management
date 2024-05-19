import { task } from "../model/tasks.js";
import taskService from "../service/taskService.js";
import userService from "../service/userService.js";
import nodemailer from "nodemailer";
async function postTask(request, response) {
  try {
    if (request.userDetails?.roleName === "admin") {
      const assignedBy = request.userDetails.userName;
      const assignedById = request.id;
      const { assignee, taskType, description, lastDate, priority } =
        request.body;

      const idValue = await userService.getIdByName(assignee);
      const assigneeId = idValue.id;
      const tasks = await task.create({
        assignedBy,
        assignedById,
        assignee,
        assigneeId,
        taskType,
        description,
        lastDate,
        priority,
      });
      const id = await userService.findEmail(assigneeId);
      const taskDetails = { ...tasks._doc };
      let config = {
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      };
      const transporter = nodemailer.createTransport(config);
      let message = {
        from: process.env.EMAIL,
        to: id.email,
        subject: "a new task assigned",
        text: `Hi ${taskDetails.assignee},\n
        ${taskDetails.assignedBy} has assigned you a task of type ${taskDetails.taskType}
        Description: ${taskDetails.description}
        Priority: ${taskDetails.priority}
        Last Date: ${taskDetails.lastDate}
        taskStatus: ${taskDetails.taskStatus}`,
      };
      transporter
        .sendMail(message)
        .then(() => {
          console.log("successfully email sent");
        })
        .catch((error) => {
          console.log(error);
        });
      response.status(201).send({ tasks: taskDetails });
    } else {
      response.status(403).send({ msg: " cannot access " });
    }
  } catch (err) {
    response.status(500).send({ msg: err.message });
  }
}

// async function getTask(request, response) {
//   try {
//     const searchQuery = request.query;
//     var id = request.id;

//     if (request.userDetails?.roleName == "admin") {
//       const { count, data } = await taskService.getAdminTask(searchQuery, id);

//       response.send({ count, data });
//       // response.send(await taskService.getAdminTask(searchQuery, id));
//     } else if (request.userDetails?.roleName == "normal") {
//       const { count, data } = await taskService.getUserTask(searchQuery, id);
//       response.send({ count, data });
//       // response.send(await taskService.getUserTask(searchQuery, id));
//     }
//   } catch (err) {
//     // console.log("..............//////////////");
//     response.status(500).send(err.message);
//   }
// }

async function deleteTask(request, response) {
  try {
    if (request.userDetails?.roleName == "admin") {
      const { taskId } = request.body;
      response.status(200).send(await taskService.deleteTaskService(taskId));
    } else {
      response.status(403).send({ msg: "do not have access" });
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function updateTask(request, response) {
  try {
    const { taskId, taskStatus } = request.body;
    const rolePermissions = {
      normal: {
        "in progress": true,
        request: true,
        completed: false,
      },
      admin: {
        "in progress": true,
        request: true,
        completed: true,
      },
    };

    const currentUserRole = request.userDetails.roleName;

    if (!rolePermissions[currentUserRole][taskStatus]) {
      return response.send({
        msg:
          "You do not have the access to change the task status to " +
          taskStatus,
      });
    }
    const TaskExist = await taskService.updateTaskService(
      taskId,
      taskStatus,
      request.id
    );
    response.send(TaskExist ? TaskExist : { msg: "cannot update" });
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function updateToBacklog() {
  try {
    console.log("cron is running in update to backlog ");
    const tasks = await taskService.checkStatus();
    if (tasks) {
      for (const task of tasks) {
        await taskService.updateToBacklogService(task);
      }
    }
    return;
    // response.send({ msg: "Tasks updated to backlog" });
  } catch (error) {
    console.log(error.message);
    // response.status(500).send({ msg: error });
  }
}

async function getTask(request, response) {
  try {
    // const searchQuery = request.query;
    // var id = request.id;
    // const page = request.body.page || 1;
    // const limit = request.body.limit || 5;
    // const skip = (page - 1) * limit;
    // if (request.userDetails?.roleName == "admin") {
    //   const { count, data } = await taskService.getAdminTask(
    //     searchQuery,
    //     id,
    //     skip,
    //     limit
    //   );
    //   response.send({ count, data });
    // } else if (request.userDetails?.roleName == "normal") {
    //   const { count, data } = await taskService.getUserTask(
    //     searchQuery,
    //     id,
    //     skip,
    //     limit
    //   );
    //   response.send({ count, data });
    // }

    const { page, limit, order, orderBy, ...searchQuery } = request.query;
    var id = request.id;
    const bodyPage = page || 1;
    const bodyLimit = limit || 5;
    const skip = (bodyPage - 1) * limit;
    const bodyOrder = order || "createdAt";
    const bodyOrderBy = orderBy || 1;
    if (request.userDetails?.roleName == "admin") {
      const { count, data } = await taskService.getAdminTask(
        searchQuery,
        id,
        skip,
        bodyLimit,
        bodyOrder,
        bodyOrderBy
      );
      response.send({ count, data });
    } else if (request.userDetails?.roleName == "normal") {
      const { count, data } = await taskService.getUserTask(
        searchQuery,
        id,
        skip,
        bodyLimit,
        bodyOrder,
        bodyOrderBy
      );
      response.send({ count, data });
    }
  } catch (err) {
    // console.log("..............//////////////");
    response.status(500).send(err.message);
  }
}

export default { postTask, getTask, deleteTask, updateTask, updateToBacklog };
