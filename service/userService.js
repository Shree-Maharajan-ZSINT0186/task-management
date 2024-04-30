import { role } from "../model/role.js";
import { session } from "../model/session.js";
import { user } from "../model/user.js";

async function insertUserService(userName, password, roleId) {
  return await user.create({ userName, password, roleId });
}
async function getUserByName(userName) {
  return await user.findOne({ userName });
}
async function insertToken(userId, token) {
  return await session.create({ userId, token });
}
async function getIdByToken(token) {
  return await session.findOne({ token }, { userId: 1 });
}
async function getRoleId(id) {
  try {
    const userRecord = await user.findOne({ _id: id }, { roleId: 1 });
    return userRecord ? userRecord.roleId : null;
    // return await user.findOne({ _id: id }, { roleId: 1 });
  } catch (error) {
    console.error("Error fetching role ID:", error);
    return null;
  }
}

async function getRoleName(roleId) {
  return await role.findOne({ roleId }, { _id: 0, roleName: 1 });
}

async function expiryToken(token) {
  return await session.updateOne({ token }, { expiry: "yes" });
}
async function updateRoleService(userId, roleId) {
  try {
    const userUpdate = await user.updateOne({ _id: userId }, { roleId });
    return userUpdate ? userUpdate : null;
  } catch (error) {
    console.error("Error fetching role ID:", error);
    return null;
  }
}
async function getNameById(userId) {
  return await user.findOne({ _id: userId }, { _id: 0, userName: 1 });
}
async function getIdByName(userName) {
  return await user.findOne({ userName }, { _id: 1 });
}
export default {
  insertUserService,
  getUserByName,
  insertToken,
  getIdByToken,
  getRoleId,
  getRoleName,
  expiryToken,
  updateRoleService,
  getNameById,
  getIdByName,
};
