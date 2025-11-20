import mongoose from "mongoose";
import {Department} from "../server/src/models/department" // 改成你的路径

const run = async () => {
  await mongoose.connect("mongodb+srv://lappland_db_user:kHPRWajKLzMaKrGp@immigration-visa-dev.ckwdcvh.mongodb.net/test/employees");

  await Department.create({ collegeName: "Engineering", departmentName: "Computer Science" });
  await Department.create({ collegeName: "Science", departmentName: "Physics" });

  console.log("Departments seeded");
  mongoose.disconnect();
};

run();
