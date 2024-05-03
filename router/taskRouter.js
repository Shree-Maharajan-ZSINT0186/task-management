import express from "express";

import taskController from "../controller/taskController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router
  .route("/")
  .post(auth, taskController.postTask)
  .get(auth, taskController.getTask)
  .delete(auth, taskController.deleteTask)
  .put(auth, taskController.updateTask);

export default router;
