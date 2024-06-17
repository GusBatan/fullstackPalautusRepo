import { Diagnose } from '../types/types';
import data from '../data/diagnoses';

export const getEntries = (): Diagnose[] => {
  return data;
};
