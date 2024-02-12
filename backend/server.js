import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import userRoute from "../backend/routes/userRoute.js";
import chatRoutes from "../backend/routes/chatRoutes.js";
import messageRoutes from "../backend/routes/messageRoute.js";

//config
dotenv.config();

//database
connectDB();

//express
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

// app.use("/api/v1/group",groupRoute);

//test
app.get("/", (req, res) => {
  res.send({
    message: "welcome to the app",
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
