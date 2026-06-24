import express, { Router } from "express";
import analysisControler from "../controller/analysis.controller.js";
const router = express.Router();
router.post("/analysis", analysisControler.analyzeControler);
export default router;
