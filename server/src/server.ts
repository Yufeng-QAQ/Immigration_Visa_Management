import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/userRoutes";
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
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// Routers
app.use("/api/users", userRouter);
app.use("/api/employee", employeeRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
