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
  console.log(request.body);
  const { userName, password, roleId } = request.body;

  if (password.length <= 8) {
    response
      .status(401)
      .send({ msg: "password should be more than 8 charachers" });
  } else {
    const hashedPassword = await genHashPassword(password);
    response.send(
      await userService.insertUserService(userName, hashedPassword, roleId)
    );
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
    const ispasswordcheck = await bcrypt.compare(password, storedDBPassword);
    if (ispasswordcheck) {
      const token = jwt.sign({ id: userFromDB.id }, process.env.SECRET_KEY);
      userService.insertToken(userFromDB.id, token);

      response.send({ msg: "successful login", token });
    } else {
      response.status(401).send(ERROR_MESSAGE);
    }
  }
}

async function logout(request, response) {
  const token = request.header("x-auth-token");
  if (userService.expiryToken(token)) {
    response.send({ msg: "successful logout" });
  }
}

async function updateRole(request, response) {
  // const userId = request.params;
  const { userId, roleId } = request.body;

  console.log(request.roleDetail.roleName);
  if (request.roleDetail.roleName == "super user") {
    userService.updateRoleService(userId, roleId);
    response.send("updated succeessfully");
  } else {
    response.send("dont have access");
  }
}
export default { signup, login, updateRole, logout };
