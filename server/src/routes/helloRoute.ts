import express from "express";
import { sendHello } from "../controllers/startController";

const router = express.Router();

router.get("/", sendHello)


export default router;