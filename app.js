import express from "express";

import userRouter from "./router/userRouter.js";
import taskRouter from "./router/taskRouter.js";
// import { auth } from "express-openid-connect";
import cron from "node-cron";
import taskController from "./controller/taskController.js";
import morgan from "morgan";
// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: "a long, randomly-generated string stored in env",
//   baseURL: "http://localhost:4000",
//   clientID: "XUb3aWEVAD1RDxw9eMbwfQ17oFdOJx3V",
//   issuerBaseURL: "https://dev-g72bz7sfwevquifa.us.auth0.com",
// };

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// app.get("/", function (request, response) {
//   response.send("🙋‍♂️, 🌏 🎊✨🤩");
// });

// app.use(auth(config));

const updateToBacklogTask = () => {
  taskController.updateToBacklog();
};
// cron.schedule("59 23 * * *", updateToBacklogTask);
// cron.schedule("* * * * *", updateToBacklogTask);

app.use("/user", userRouter);
app.use("/tasks", taskRouter);

// app.get("/", (req, res) => {
//   if (req.oidc.isAuthenticated()) {
//     // res.redirect("/profile");
//     // res.send("login successfully");
//     res.send(req.oidc.user);
//   } else {
//     res.send("logout");
//   }
// });

export { app };
