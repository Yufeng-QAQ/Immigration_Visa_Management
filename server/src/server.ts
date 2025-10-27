import express from "express";
import session from "express-session"
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRoutes";
import employeeRouter from "./routes/employeeRoutes";

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
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY || "defaultSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,
      sameSite: "lax"
    }
  })
)

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routers
app.use("/api/auth", authRouter);
app.use("/api/employee", employeeRouter);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
