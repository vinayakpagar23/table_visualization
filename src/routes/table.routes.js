import {Router} from "express";
import { validateToken } from "../middlewares/auth.middleware.js";
import { getTables, insertTable } from "../controllers/table.controller.js";

const router =Router();

router.route("/insertTable").post(validateToken,insertTable);
router.route("/getTables").get(validateToken,getTables);


export default router;