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
  const { userName, email, password, roleId } = request.body;
  try {
    if (password.length <= 8) {
      response.status(400).send({
        error: "Bad Request",
        msg: "Password should be more than 8 characters",
      });
      // return;
    } else {
      const hashedPassword = await genHashPassword(password);
      const user = await userService.insertUserService(
        userName,
        email,
        hashedPassword,
        roleId
      );
      if (user?.username && user?.password) {
        const userDetail = {
          ...user._doc,
          password: undefined,
          _id: undefined,
        };
        response.status(200).send({ msg: "signedup succesfully" });
      } else {
        response.status(401).send({ msg: "Can't sign up" });
      }
    }
  } catch (err) {
    response
      .status(500)
      .send({ error: "Internal Server Error", msg: err.message });
  }
}

export async function login(request, response) {
  try {
    const { userName, password } = request.body;
    const userFromDB = await userService.getUserByName(userName);
    const ERROR_MESSAGE = { msg: "invalid credentials" };
    // console.log(userFromDB);
    if (!userFromDB) {
      response.status(401).send({ msg: "invalid credential" });
    } else {
      const storedDBPassword = userFromDB.password;
      const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
      if (isPasswordCheck) {
        const token = generateToken(userFromDB);
        await userService.insertToken(userFromDB.id, token);
        response.status(200).send({ msg: "successful login", token });
      } else {
        response.status(401).send({ msg: "invalid credentials" });
      }
    }
  } catch (error) {
    response.status(500).send({ msg: error.message });
  }
}

function generateToken(userFromDB) {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      id: userFromDB.id,
      iat: currentTimestamp,
      exp: currentTimestamp + 60 * 60,
    },
    process.env.SECRET_KEY
  );
}

async function logout(request, response) {
  try {
    const token = request.header("x-auth-token");
    await userService.expiryToken(token);
    response.status(200).send({ msg: "logout successful" });
  } catch {
    response.status(500).send({ msg: "something went wrong" });
  }
}

async function updateRole(request, response) {
  try {
    const { userId, roleId } = request.body;
    if (request.userDetails.roleName === "super user") {
      await userService.updateRoleService(userId, roleId);
      response.status(200).send({ msg: "updated successfully" });
    } else {
      response.status(403).send({ msg: "don't have access" });
    }
  } catch (err) {
    response.status(500).send({ msg: err.message });
  }
}

async function getUser(request, response) {
  try {
    if (request.userDetails?.roleName == "admin") {
      response.status(200).send(await userService.getAllUserService());
    } else {
      response.status(403).send({ msg: "do not have access" });
    }
  } catch (err) {
    response.status(500).send(err.message);
  }
}

export default {
  signup,
  login,
  updateRole,
  logout,
  getUser,
  generateToken,
  genHashPassword,
};
