import express from "express";
import { getEntries } from "../service/diagnosesService";
import { Diagnose } from "../types/types";
const router = express.Router();

router.get("/", (_req, res) => {
  try {
    const data: Diagnose[] = getEntries();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching diagnoses");
  }
});

export default router;
