import data from '../data/patients';
import { OmitSsnEntry, NewPatientEntry, Patient } from '../types/types';
import { v1 as uuid } from 'uuid';

export const getEntriesWithNoSsn = (): OmitSsnEntry[] => {
  return data.map(({ id, name, gender, occupation, dateOfBirth }) => ({
    id,
    name,
    gender,
    occupation,
    dateOfBirth,
  }));
};

export const addEntry = (entry: NewPatientEntry): Patient => {
  const id: string = uuid();
  const newPatientEntry = {
    id,
    ...entry,
  };
  data.push(newPatientEntry);
  return newPatientEntry;
};
