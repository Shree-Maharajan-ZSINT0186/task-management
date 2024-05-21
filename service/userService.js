import { role } from "../model/role.js";
import { session } from "../model/session.js";
import { user } from "../model/user.js";
// const asyncErrorHandler = require("./../Utils/asyncErrorHandler");

async function insertUserService(userName, email, password, roleId) {
  return await user.create({ userName, email, password, roleId });
}
async function getUserByName(userName) {
  try {
    const obje = await user.findOne({ userName });
    return obje;
  } catch (error) {
    return error.msg;
  }
}
async function insertToken(userId, token) {
  return await session.create({ userId, token });
}

async function deleteToken(token) {
  return await session.deleteOne({ token });
}

async function expiryToken(token) {
  return await session.updateOne({ token }, { expiry: "yes" });
}

async function getNameById(userId) {
  return await user.findOne({ _id: userId }, { _id: 0, userName: 1 });
}
async function getIdByName(userName) {
  return await user.findOne({ userName }, { _id: 1 });
}

async function getAllUserService() {
  return await user.find({});
}

async function findUser(assignee) {
  return await user.findOne({ userName: assignee }, { _id: 0, userName: 1 });
}

async function updateRoleService(userId, roleId) {
  return await user.updateOne({ _id: userId }, { roleId });
}
async function findEmail(id) {
  return await user.findOne({ _id: id }, { _id: 0, email: 1 });
}

async function userDetail(id) {
  const name = await user.findOne({ _id: id }, { _id: 0, userName: 1 });
  const userName = name.userName;
  const roles = await user.findOne({ _id: id }, { _id: 0, roleId: 1 });
  const roleId = roles.roleId;
  const userEmail = await user.findOne({ _id: id }, { _id: 0, email: 1 });
  const email = userEmail.email;
  const roleDetail = await role.findOne(
    { roleId: roles.roleId },
    { _id: 0, roleName: 1 }
  );
  const roleName = roleDetail.roleName;
  // console.log(name, "hi ", roleId, "hi", roleName);
  return { userName, roleId, roleName, email };
}

async function findToken(token) {
  // console.log(token);
  return await session.findOne({ token }, { expiry: 1 });
  // return await session.findOne({ token });
}

export default {
  insertUserService,
  getUserByName,
  insertToken,

  expiryToken,
  updateRoleService,
  getNameById,
  getIdByName,
  getAllUserService,
  findUser,
  userDetail,
  findEmail,
  deleteToken,
  findToken,
};
