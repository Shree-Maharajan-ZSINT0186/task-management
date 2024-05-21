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

const mockUser = {
  _id: "664468019ad4cd44498b691b",
  username: "shreenehaa",
  password: "$2b$10$0VV7RjaU240q2WBg42LOuusJUfAr3kdfMSGlGP6VWls3Kz2.cZp.G",
  roleId: 1,
};

const authToken = userController.generateToken(mockUser);
