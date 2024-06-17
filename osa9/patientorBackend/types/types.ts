export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient {
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  id: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}
export type OmitSsnEntry = Omit<Patient, 'ssn'>;
export type NewPatientEntry = Omit<Patient, 'id'>;
