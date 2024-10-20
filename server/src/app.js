import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./api-docs/swagger-output.json" assert { type: "json" };

let app = express();

app.use(express.json({ limit: "22kb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_PATH || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(urlencoded({ limit: "15kb", extended: true }));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static("dist"));

// import routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import chatRouter from "./routes/chat.routes.js";
import notificationsRouter from "./routes/notification.routes.js";

// use routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/notification", notificationsRouter);

export default app;
