import { Router } from "express";
import { UserContoller } from "../controllers/userContoller";

const router = Router();
const controller = new UserContoller();

router.get("/getAllUsers", controller.getAllUsers);
router.post("/createUser", controller.createUser);
router.put("/:id/updateUser", controller.updateUser);
router.delete("/:id/deleteUser", controller.deleteUser);

export default router;