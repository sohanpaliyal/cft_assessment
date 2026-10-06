import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes";
import userRoutes from "./routes/user.routes";

import {
  errorMiddleware,
} from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Chat backend running",
  });
});

app.use(
  "/chat",
  chatRoutes
);

app.use(
  "/user",
  userRoutes
);

app.use(errorMiddleware);

export default app;