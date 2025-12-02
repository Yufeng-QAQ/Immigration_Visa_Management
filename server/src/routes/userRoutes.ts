import { Router } from "express";
import { UserContoller } from "../controllers/userContoller";

const router = Router();
const controller = new UserContoller();

router.get("/getAllUsers", controller.getAllUsers);
router.get("/getUserById/:id", controller.getUserById);
router.post("/createUser", controller.createUser);
router.put("/updateUser/:id", controller.updateUser);
router.delete("/deleteUser/:id", controller.deleteUser);

export default router;