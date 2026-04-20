import { Router } from "express";

import { login, register } from "../controllers/auth.controllers.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../midllewares/validator.middleware.js";
import { userLoginValidator, userRegisterValidator } from "../validators/index.js";

const router = Router()

// router.post("/register", validate(userRegisterValidator()), asyncHandler(register))
// router.post("/login", validate(userLoginValidator()), asyncHandler(login))

router.route("/register").post(userRegisterValidator(), validate, asyncHandler(register))
router.route("/login").post(userLoginValidator(), validate, asyncHandler(login))

export default router