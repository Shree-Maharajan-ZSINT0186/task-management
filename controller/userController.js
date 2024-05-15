import userService from "../service/userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

async function genHashPassword(password) {
  const NO_OF_ROUND = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUND);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function signup(request, response) {
  try {
    const { userName, email, password, roleId } = request.body;

    if (password.length <= 8) {
      response
        .status(401)
        .send({ msg: "password should be more than 8 characters" });
    } else {
      const hashedPassword = await genHashPassword(password);
      const user = await userService.insertUserService(
        userName,
        email,
        hashedPassword,
        roleId
      );
      const userDetail = { ...user._doc, password: undefined, _id: undefined };
      response.status(201).send(userDetail);
    }
  } catch (err) {
    response.status(500).send({ msg: err.message });
  }
}

async function login(request, response) {
  const { userName, password } = request.body;
  const userFromDB = await userService.getUserByName(userName);
  const ERROR_MESSAGE = { msg: "invalid credentials" };
  // console.log(userFromDB);
  if (!userFromDB) {
    response.status(401).send(ERROR_MESSAGE);
  } else {
    const storedDBPassword = userFromDB.password;
    const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
    if (isPasswordCheck) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const token = jwt.sign(
        {
          id: userFromDB.id,
          iat: currentTimestamp,
          exp: currentTimestamp + 1 * 60,
        },
        process.env.SECRET_KEY
      );
      userService.insertToken(userFromDB.id, token);

      response.send({ msg: "successful login", token });
    } else {
      response.status(401).send(ERROR_MESSAGE);
    }
  }
}

async function logout(request, response) {
  try {
    const token = request.header("x-auth-token");
    await userService.expiryToken(token);
    response.status(200).send({ msg: "logout successful" });
  } catch {
    response.status(501).send({ msg: "something went wrong" });
  }
}

async function updateRole(request, response) {
  try {
    const { userId, roleId } = request.body;
    if (request.userDetails.roleName == "super user") {
      userService.updateRoleService(userId, roleId);
      response.status(200).send({ msg: "updated successfully" });
    } else {
      response.status(403).send({ msg: "don't have access" });
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
}

async function getUser(request, response) {
  try {
    if (request.userDetails?.roleName == "admin") {
      response.send(await userService.getAllUserService());
    } else {
      response.status(401).send({ msg: "do not have access" });
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
}

export default { signup, login, updateRole, logout, getUser };
