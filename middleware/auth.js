import jwt from "jsonwebtoken";
import { session } from "../model/session.js";
import userService from "../service/userService.js";

const auth = async (request, response, next) => {
  try {
    const token = request.header("x-auth-token");
    jwt.verify(token, process.env.SECRET_KEY);
    const tokenCheck = await session.findOne({
      token: token,
      expiry: "no",
    });
    const user = await userService.getIdByToken(token);
    const name = await userService.getNameById(user.userId);
    const roleid = await userService.getRoleId(user.userId);
    const roleDetail = await userService.getRoleName(roleid);
    if (tokenCheck) {
      request.token = token;
      request.user = user;
      request.name = name;
      request.roleid = roleid;
      request.roleDetail = roleDetail;
      next();
    } else {
      response.status(401).send({ msg: "Login expired" });
    }
  } catch (err) {
    response.status(401).send({ msg: err.message });
  }
};
export { auth };
