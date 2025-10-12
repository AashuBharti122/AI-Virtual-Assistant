import express from "express";
import {logOut, logIn, signUp} from "../controllers/auth.controllers.js";

const authRouter = express.Router();


authRouter.post("/signup", signUp);
authRouter.post("/signin", logIn);
authRouter.get("/logout", logOut);

export default authRouter;