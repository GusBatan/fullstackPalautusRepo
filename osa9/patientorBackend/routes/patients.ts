import express from 'express';
import { getEntriesWithNoSsn, addEntry } from '../service/patientsService';
import toNewPatientEntry from '../utils';
import { OmitSsnEntry } from '../types/types';
const router = express.Router();

router.get('/', (_req, res) => {
  try {
    const data: OmitSsnEntry[] = getEntriesWithNoSsn();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching patient entries');
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedPatient = addEntry(newPatient);
    res.json(addedPatient);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding patient entry');
  }
});

export default router;
