import express from "express";
import {
  getEntriesWithNoSsn,
  addPatient,
  findById,
  addEntry,
} from "../service/patientsService";
import { toNewEntry, toNewPatientEntry } from "../utils";
import { OmitSsnEntry } from "../types/types";
const router = express.Router();

router.get("/", (_req, res) => {
  try {
    const data: OmitSsnEntry[] = getEntriesWithNoSsn();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching patient entries");
  }
});

router.get("/:id", (req, res) => {
  const patient = findById(req.params.id);
  if (patient) {
    res.status(200).json(patient);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += `Error ${error.message}`;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = addEntry(req.params.id, newEntry);

    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
});

export default router;
