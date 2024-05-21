import { app } from "../app.js";
import request from "supertest";
import userController from "../controller/userController.js";
import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user } from "../model/user.js";
import { session } from "../model/session.js";
import { role } from "../model/role.js";
import mongoose from "mongoose";

beforeAll((done) => {
  done();
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});

jest.unstable_mockModule("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn().mockReturnValue({ id: 1654321 }),
}));

const mockUser = {
  _id: "664468019ad4cd44498b691b",
  username: "shreenehaa",
  password: "$2b$10$0VV7RjaU240q2WBg42LOuusJUfAr3kdfMSGlGP6VWls3Kz2.cZp.G",
  roleId: 1,
};

const authToken = userController.generateToken(mockUser);

describe("userController/signup", () => {
  test("POST /user/signup should return status code 200", async () => {
    jest.spyOn(user, "create").mockImplementation(() => ({
      username: "shreenehaa",
      email: "shreenehaa2003@gmail.com",
      password: "shree@134243",
      roleId: 1,
    }));

    const res = await request(app).post("/user/signup").send({
      username: "shreenehaa",
      password: "shree@134243",
    });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe("signedup succesfully");
  });

  test("POST/User should return status code 400", async () => {
    jest.spyOn(user, "create").mockImplementation(() => ({
      username: "shreenehaa",
      email: "shreenehaa2003@gmail.com",
      password: "shree",
      roleId: 1,
    }));
    await request(app)
      .post("/user/signup")
      .send({
        username: "shreenehaa",
        password: "shree",
      })
      .expect(400);
  });
  test("POST/User should return status code 401", async () => {
    jest.spyOn(user, "create").mockImplementation(() => ({
      username: "shreenehaa",
      email: "shreenehaa2003@gmail.com",
      // password: "shree",
      roleId: 1,
    }));
    await request(app)
      .post("/user/signup")
      .send({
        username: "shreenehaa",
        password: "shreenehaa@1234",
      })
      .expect(401);
  });

  test("POST/User should return status code 500", async () => {
    jest.spyOn(user, "create").mockImplementation(() => {
      throw new Error("msg");
    });
    await request(app)
      .post("/user/signup")
      .send({
        username: "shreenehaa",
        password: "shreenehaa@123",
      })
      .expect(500);
  });
});

describe("userConroller/login", () => {
  test("POST/User should return status code 200", async () => {
    bcrypt.compare = jest.fn(() => true);
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      userName: "shreenehaa",
      password: "shreenehaa@123",
    }));
    jest.spyOn(session, "create").mockImplementation();

    const res = await request(app).post("/user/login").send({
      userName: "shreenehaa",
      password: "shreenehaa@123",
    });
    expect(res.status).toEqual(200);
    expect(res.body.msg).toEqual("successful login");
  }, 20000);

  test("POST/User should return status code 401", async () => {
    jest.spyOn(user, "findOne").mockImplementation(() => null);
    const res = await request(app).post("/user/login").send({
      userName: "shreenehaa",
      password: "",
    });
    expect(401);
  }, 20000);

  test("POST/User should return status code 401", async () => {
    jest.spyOn(user, "findOne").mockImplementation(() => null);
    const res = await request(app).post("/user/login").send({
      userName: "",
      password: "shreenehaa@123",
    });
    expect(res.status).toEqual(401);
    expect(res.body.msg).toEqual("invalid credential");
  }, 20000);

  test("POST/User should return status code 401", async () => {
    bcrypt.compare = jest.fn(() => false);
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      userName: "shreenehaa",
      password: "shreenehaa@",
    }));
    const res = await request(app).post("/user/login").send({
      userName: "shreenehaa",
      password: "shreenehaa@123",
    });
    expect(res.status).toEqual(401);
    expect(res.body.msg).toEqual("invalid credentials");
  }, 20000);

  test("POST /user/login should return status code 500 on server error", async () => {
    jest.spyOn(user, "findOne").mockImplementation(() => ({
      userName: "rajasekar",
      password: "rajasekar@123",
    }));
    bcrypt.compare = jest.fn(() => true);
    jest.spyOn(session, "create").mockImplementation(() => {
      throw new Error("msg");
    });

    const res = await request(app).post("/user/login").send({
      userName: "rajasekar",
      password: "rajasekar@123",
    });
    expect(res.status).toEqual(500);
  }, 20000);
});

describe("userControll/logout", () => {
  test("POST/User should return status code 200", async () => {
    jest.spyOn(session, "updateOne").mockImplementation();
    const res = await request(app)
      .put("/user/logout")
      .set("x-auth-token", authToken)
      .expect(200);
  });

  test("POST/User should return status code 500", async () => {
    jest.spyOn(session, "updateOne").mockImplementation(() => {
      throw new Error("msg");
    });
    const res = await request(app)
      .put("/user/logout")
      .set("x-auth-token", authToken)
      .expect(500);
  });
});

describe("userControll/updateRole", () => {
  jwt.verify = jest.fn(() => ({
    id: 1,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }));
  jest.spyOn(session, "findOne").mockImplementation(() => ({
    expiry: "no",
  }));
  jest.spyOn(user, "findOne").mockImplementation(() => ({
    userName: "esa",
    roleId: 1,
    email: "qwerty",
  }));

  test("POST/User should return status code 200", async () => {
    jest
      .spyOn(role, "findOne")
      .mockImplementation(() => ({ roleName: "super user" }));
    jest.spyOn(user, "updateOne").mockImplementation();
    const response = await request(app)
      .put("/user/updateRole")
      .set("x-auth-token", authToken)
      .send({ userId: 1, roleId: 2 });

    expect(response.status).toEqual(200);
  });

  test("POST/User should return status code 403", async () => {
    jest
      .spyOn(role, "findOne")
      .mockImplementation(() => ({ roleName: "normal" }));
    jest.spyOn(user, "updateOne").mockImplementation();
    const response = await request(app)
      .put("/user/updateRole")
      .set("x-auth-token", authToken)
      .send({ userId: 1, roleId: 2 });

    expect(response.status).toEqual(403);
  });

  test("POST/User should return status code 500", async () => {
    jest
      .spyOn(role, "findOne")
      .mockImplementation(() => ({ roleName: "super user" }));
    jest.spyOn(user, "updateOne").mockImplementation(() => {
      throw new Error("msg");
    });
    const response = await request(app)
      .put("/user/updateRole")
      .set("x-auth-token", authToken)
      .expect(500);

    //expect(response.status).toEqual(500);
  });
});

describe("userControll/getUser", () => {
  jwt.verify = jest.fn(() => ({
    id: 1,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }));
  jest.spyOn(session, "findOne").mockImplementation(() => ({
    expiry: "no",
  }));
  jest.spyOn(user, "findOne").mockImplementation(() => ({
    userName: "esa",
    roleId: 1,
    email: "qwerty",
  }));

  test("POST/User should return status code 200", async () => {
    jest
      .spyOn(role, "findOne")
      .mockImplementation(() => ({ roleName: "admin" }));
    jest.spyOn(user, "find").mockImplementation();
    const response = await request(app)
      .get("/user")
      .set("x-auth-token", authToken)
      .send({});

    expect(response.status).toEqual(200);
  });

  test("POST/User should return status code 403", async () => {
    jest
      .spyOn(role, "findOne")
      .mockImplementation(() => ({ roleName: "normal" }));
    jest.spyOn(user, "find").mockImplementation();
    const response = await request(app)
      .get("/user")
      .set("x-auth-token", authToken);

    expect(response.status).toEqual(403);
  });

  test("POST/User should return status code 500", async () => {
    jest
      .spyOn(role, "findOne")
      .mockImplementation(() => ({ roleName: "admin" }));
    jest.spyOn(user, "find").mockImplementation(() => {
      throw new Error("msg");
    });
    const response = await request(app)
      .get("/user")
      .set("x-auth-token", authToken);

    expect(response.status).toEqual(500);
  });
});
