import { app } from "./app.js";
import connectDb from "./config.js";
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`The server started in: ${PORT} ✨✨`);
  connectDb();
  console.log("database mongo connected ");
});
