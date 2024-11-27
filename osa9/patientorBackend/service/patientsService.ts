import data from "../data/patients";
import {
  OmitSsnEntry,
  NewPatientEntry,
  Patient,
  EntryWithoutId,
  Entry,
} from "../types/types";
import { v1 as uuid } from "uuid";

export const getEntriesWithNoSsn = (): OmitSsnEntry[] => {
  return data.map(({ id, name, gender, occupation, dateOfBirth, entries }) => ({
    id,
    name,
    gender,
    occupation,
    dateOfBirth,
    entries,
  }));
};

export const findById = (id: string): Patient | undefined => {
  const patient = data.find((patient) => patient.id === id);
  if (patient) {
    return patient;
  } else {
    return;
  }
};

export const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const newId: string = uuid();
  const newEntry = {
    id: newId,
    ...entry,
  };
  const idx: number = data.findIndex((patient) => patientId === patient.id);
  if (idx === -1) {
    throw Error("Patient not found");
  } else {
    data[idx].entries.push(newEntry);
    return newEntry;
  }
};

export const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };
  data.push(newPatientEntry);
  return newPatientEntry;
};
