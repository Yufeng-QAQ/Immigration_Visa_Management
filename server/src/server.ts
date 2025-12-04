import express from "express";
import session from "express-session"
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import MongoStore from "connect-mongo"

import { userAuthenticate } from "./middlewares/authMiddleware";
import authRouter from "./routes/authRoutes";
import employeeRouter from "./routes/employeeRoutes";
import userRouter from "./routes/userRoutes";
import logRouter from "./routes/logRoutes";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error(
    "Please define the MONGODB_URI and MONGODB_DB environment variables inside .env"
  );
}

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY || "defaultSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: undefined,
    },
    store: MongoStore.create({
      mongoUrl: uri,
      collectionName: "sessions",
      ttl: 6 * 60 * 60,
      autoRemove: "native",
    }),
  })
)

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routers
app.use("/api/auth", authRouter);
app.use("/api/employee", userAuthenticate, employeeRouter);
app.use("/api/user", userAuthenticate, userRouter);
app.use("/api/log", userAuthenticate, logRouter);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
