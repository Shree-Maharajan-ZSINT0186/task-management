import express from "express";
import connectDb from "./config.js";
import userRouter from "./router/userRouter.js";
import taskRouter from "./router/taskRouter.js";
import { auth } from "express-openid-connect";
import cron from "node-cron";
import taskController from "./controller/taskController.js";

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
const PORT = 4000;
// app.get("/", function (request, response) {
//   response.send("🙋‍♂️, 🌏 🎊✨🤩");
// });

// app.use(auth(config));

const updateToBacklogTask = () => {
  taskController.updateToBacklog(); // Call the controller function to update tasks to backlog
  console.log("cron is running");
};
cron.schedule("* * * * *", updateToBacklogTask);

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

app.listen(PORT, () => {
  console.log(`The server started in: ${PORT} ✨✨`);
  connectDb();
  console.log("database mongo connected ");
});
