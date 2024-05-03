import jwt from "jsonwebtoken";
import { session } from "../model/session.js";
import userService from "../service/userService.js";
const expiredToken = [];
const isTokenBlacklisted = (token) => {
  return expiredToken.includes(token);
};
const auth = async (request, response, next) => {
  try {
    const token = request.header("x-auth-token");
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    const { id } = decodeToken;
    // console.log(id);
    // const tokenCheck = await session.findOne({
    //   token: token,
    //   expiry: "no",
    // });
    // const user = await userService.getIdByToken(token);

    const name = await userService.getNameById(id);
    const roleid = await userService.getRoleId(id);
    const roleDetail = await userService.getRoleName(roleid);
    request.id = id;
    request.name = name;
    request.roleid = roleid;
    request.roleDetail = roleDetail;

    isTokenBlacklisted(token)
      ? response.status(401).send({ msg: "tokenis expired please login again" })
      : next();
    // if (tokenCheck) {
    //   request.token = token;
    //   request.user = user;
    //   request.name = name;
    //   request.roleid = roleid;
    //   request.roleDetail = roleDetail;
    //   next();
    // } else {
    //   response.status(401).send({ msg: "Login expired" });
    // }
  } catch (err) {
    response.status(401).send({ msg: err.message });
  }
};
export { auth, expiredToken };
