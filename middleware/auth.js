import jwt from "jsonwebtoken";
import { session } from "../model/session.js";
import userService from "../service/userService.js";
const auth = async (request, response, next) => {
  const token = request.header("x-auth-token");
  try {
    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    const { id } = decodeToken;
    const userDetails = await userService.userDetail(id);
    const tokenCheck = await userService.findToken(token);
    if (
      Math.floor(Date.now() / 1000) < decodeToken.exp &&
      tokenCheck.expiry === "no"
    ) {
      request.id = id;
      request.userDetails = userDetails;
      next();
    } else {
      console.log("in else");
    }
  } catch {
    await userService.expiryToken(token);
    response.status(401).send({ msg: "Login expired" });
  }
};
export { auth };
