import { app } from "../app.js";
import request from "supertest";
import userController from "../controller/userController.js";
import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user } from "../model/user.js";
import { session } from "../model/session.js";
import { role } from "../model/role.js";
import { task } from "../model/tasks.js";
import taskController from "../controller/taskController.js";
import nodemailer from "nodemailer";
const mockUser = {
  _id: "664468019ad4cd44498b691b",
  username: "shreenehaa",
  password: "$2b$10$0VV7RjaU240q2WBg42LOuusJUfAr3kdfMSGlGP6VWls3Kz2.cZp.G",
  roleId: 1,
};

const authToken = userController.generateToken(mockUser);

describe("taskController/getTask", () => {
  jwt.verify = jest.fn(() => ({
    id: 1,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }));
  jest.spyOn(session, "findOne").mockResolvedValue({ expiry: "no" });
  jest.spyOn(user, "findOne").mockResolvedValue({
    userName: "esa",
    roleId: 1,
    email: "qwerty",
  });
  test("get/task should return status code 200", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "admin" });
    const mockTaskLimit = jest.fn(() => ({}));
    const mockTaskSkip = jest.fn(() => ({ limit: mockTaskLimit }));
    const mockTaskSort = jest.fn(() => ({ skip: mockTaskSkip }));
    const mockTaskFind = jest.fn(() => ({ sort: mockTaskSort }));
    jest.spyOn(task, "find").mockImplementation(mockTaskFind);

    jest.spyOn(task, "countDocuments").mockResolvedValue(1);
    const response = await request(app)
      .get("/tasks")
      .set("x-auth-token", "authToken");

    expect(response.status).toEqual(200);
    expect(response.body.msg).toEqual("admin tasks");
  });
  test("get/task should return status code 200", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "normal" });
    const mockTaskLimit = jest.fn(() => ({}));
    const mockTaskSkip = jest.fn(() => ({ limit: mockTaskLimit }));
    const mockTaskSort = jest.fn(() => ({ skip: mockTaskSkip }));
    const mockTaskFind = jest.fn(() => ({ sort: mockTaskSort }));
    jest.spyOn(task, "find").mockImplementation(mockTaskFind);

    jest.spyOn(task, "countDocuments").mockResolvedValue(1);
    const response = await request(app)
      .get("/tasks")
      .set("x-auth-token", "authToken");

    expect(response.status).toEqual(200);
    expect(response.body.msg).toEqual("normal user tasks");
  });

  test("get/task should return status code 500", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "normal" });

    jest.spyOn(task, "find").mockImplementation(() => {
      throw new Error("msg");
    });

    jest.spyOn(task, "countDocuments").mockResolvedValue(1);
    const response = await request(app)
      .get("/tasks")
      .set("x-auth-token", "authToken");

    expect(response.status).toEqual(500);
  });
});

describe("taskController/deleteTask", () => {
  jwt.verify = jest.fn(() => ({
    id: 1,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }));
  jest.spyOn(session, "findOne").mockResolvedValue({ expiry: "no" });
  jest.spyOn(user, "findOne").mockResolvedValue({
    userName: "esa",
    roleId: 1,
    email: "qwerty",
  });
  test("get/task should return status code 200", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "admin" });
    jest.spyOn(task, "deleteOne").mockImplementation();

    const response = await request(app)
      .delete("/tasks")
      .set("x-auth-token", "authToken")
      .send({ taskId: 1 });

    expect(response.status).toEqual(200);
  });
  test("get/task should return status code 403", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "normal" });
    jest.spyOn(task, "deleteOne").mockImplementation();

    const response = await request(app)
      .delete("/tasks")
      .set("x-auth-token", "authToken")
      .send({ taskId: 1 });

    expect(response.status).toEqual(403);
  });

  test("get/task should return status code 500", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "admin" });
    jest.spyOn(task, "deleteOne").mockImplementation(() => {
      throw new Error("msg");
    });
    const response = await request(app)
      .delete("/tasks")
      .set("x-auth-token", authToken)
      .send({ taskId: 1 });
    expect(response.status).toEqual(500);
  });
});

describe("taskController/updateTask", () => {
  jwt.verify = jest.fn(() => ({
    id: 1,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }));
  jest.spyOn(session, "findOne").mockResolvedValue({ expiry: "no" });
  jest.spyOn(user, "findOne").mockResolvedValue({
    userName: "esa",
    roleId: 1,
    email: "qwerty",
  });
  test("update/task should return status code 200", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "admin" });
    jest.spyOn(task, "findOneAndUpdate").mockImplementation();

    const response = await request(app)
      .put("/tasks")
      .set("x-auth-token", "authToken")
      .send({ taskId: 1, taskStatus: "completed" });

    expect(response.status).toEqual(200);
  });

  test("update/task should return status code 403", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "normal" });
    jest.spyOn(task, "findOneAndUpdate").mockImplementation();

    const response = await request(app)
      .put("/tasks")
      .set("x-auth-token", "authToken")
      .send({ taskId: 1, taskStatus: "completed" });

    expect(response.status).toEqual(403);
  });

  test("update/task should return status code 500", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "admin" });
    jest.spyOn(task, "findOneAndUpdate").mockImplementation(() => {
      throw new Error("msg");
    });
    const response = await request(app)
      .put("/tasks")
      .set("x-auth-token", authToken)
      .send({ taskId: 1, taskStatus: "in progress" });
    expect(response.status).toEqual(500);
  });
});

describe("taskController/updateToBackLog", () => {
  test("should return status code 200 when tasks are updated", async () => {
    // Mock the taskService methods
    const mockFilter = jest.fn(() => [{ id: 0 }, { id: 1 }]);
    const mockTaskFind = jest.fn(() => ({ filter: mockFilter }));
    jest.spyOn(task, "find").mockImplementation(mockTaskFind);

    jest.spyOn(task, "findOneAndUpdate").mockImplementation();

    // Mock response object
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await taskController.updateToBacklog(null, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith({
      msg: "Tasks updated to backlog",
    });
  });

  test("should return status code 204 when no tasks to update", async () => {
    // Mock taskService methods
    jest.spyOn(task, "find").mockResolvedValue([]);
    jest.spyOn(task, "findOneAndUpdate").mockResolvedValue();

    // Mock response object
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await taskController.updateToBacklog(null, response);

    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalledWith({ msg: "no task to update" });
  });

  test("should return status code 500 when no tasks to update", async () => {
    jest.spyOn(task, "find").mockResolvedValue(() => {
      throw new Error("msg");
    });
    jest.spyOn(task, "findOneAndUpdate").mockResolvedValue();
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await taskController.updateToBacklog(null, response);

    expect(response.status).toHaveBeenCalledWith(500);
  });
});

describe("taskController/postTask", () => {
  jwt.verify = jest.fn(() => ({
    id: 1,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }));
  jest.spyOn(session, "findOne").mockResolvedValue({ expiry: "no" });
  jest.spyOn(user, "findOne").mockResolvedValue({
    userName: "esa",
    roleId: 1,
    email: "qwerty",
  });

  test("post /tasks should return status code 200", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "admin" });
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      id: 1,
      email: "drfghjk@gmail.com",
    }));

    jest.spyOn(task, "create").mockResolvedValue({
      assignedBy: "admin",
      assignedById: 1,
      assignee: "user",
      assigneeId: 2,
      taskType: "task",
      description: "desc",
      lastDate: "2023-01-01",
      priority: "high",
      taskStatus: "pending",
      _doc: {}, // Mock the _doc property if needed
    });

    const response = await request(app)
      .post("/tasks")
      .set("x-auth-token", "authToken")
      .send({
        assignee: "esaa",
        taskType: "enhance",
        description: "do pagination of the get tasks",
        lastDate: "05-17-2024",
        priority: 2,
      });

    expect(response.status).toEqual(200);
  });
  test("get/task should return status code 403", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "normal" });
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      id: 1,
    }));
    jest.spyOn(task, "create").mockImplementation(() => []);
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      email: "drfghjk@gmail.com",
    }));
    const response = await request(app)
      .post("/tasks")
      .set("x-auth-token", "authToken")
      .send({ id: "hgm", jk: "hjb" });

    expect(response.status).toEqual(403);
  });

  test("get/task should return status code 500", async () => {
    jest.spyOn(role, "findOne").mockResolvedValue({ roleName: "admin" });
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      id: 1,
    }));
    jest.spyOn(task, "create").mockImplementation(() => {
      throw new Error("msg");
    });
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      email: "drfghjk@gmail.com",
    }));
    const response = await request(app)
      .post("/tasks")
      .set("x-auth-token", "authToken")
      .send({ id: "hgm", jk: "hjb" });

    expect(response.status).toEqual(500);
  });
});
