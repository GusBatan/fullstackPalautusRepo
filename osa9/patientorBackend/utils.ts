import {
  DiagnoseEntry,
  Discharge,
  Entry,
  EntryWithoutId,
  Gender,
  HealthCheckRating,
  NewPatientEntry,
  SickLeave,
} from "./types/types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Malformed field date: ${date}`);
  }
  return date;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error(`Malformed field name: ${name}`);
  }
  return name;
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error(`Malformed field ssn: ${ssn}`);
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error(`Malformed field gender: ${gender}`);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error("Malformed field occupation");
  }
  return occupation;
};

const isNumber = (text: unknown): text is number => {
  return typeof text === "number" || text instanceof Number;
};

const isEntry = (entry: unknown): entry is Entry => {
  if (!entry || typeof entry !== "object" || !("type" in entry)) {
    throw new Error("Malformed or missing data");
  }
  if (!("description" in entry && "date" in entry && "specialist" in entry)) {
    throw new Error("Malformed or missing data");
  }
  return (
    entry.type === "Hospital" ||
    entry.type === "OccupationalHealthcare" ||
    entry.type === "HealthCheck"
  );
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!Array.isArray(entries)) {
    throw new Error("Malformed or missing entries");
  }
  entries.forEach((entry) => {
    if (!isEntry(entry)) {
      throw new Error("Malformed entry");
    }
  });

  return entries as Entry[];
};

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Malformed Data!");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "occupation" in object &&
    "gender" in object &&
    "entries" in object
  ) {
    return {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSSN(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: parseEntries(object.entries),
    };
  }
  throw new Error("Missing Data!");
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error("Missing info in description field");
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error("Missing info in specialist field");
  }
  return specialist;
};

const parseCriteria = (dischargeCriteria: unknown): string => {
  if (!dischargeCriteria || !isString(dischargeCriteria)) {
    throw new Error("Missing info in criteria field");
  }
  return dischargeCriteria;
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (
    !discharge ||
    typeof discharge !== "object" ||
    !("date" in discharge) ||
    !("criteria" in discharge)
  ) {
    throw new Error("Incorrect or missing data");
  }
  return {
    date: parseDate(discharge.date),
    criteria: parseCriteria(discharge.criteria),
  };
};

const parseDiagnosisCodes = (object: unknown): Array<DiagnoseEntry["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<DiagnoseEntry["code"]>;
  }
  return object.diagnosisCodes as Array<DiagnoseEntry["code"]>;
};

const isHealthCheck = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map((v) => v as number)
    .includes(param);
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (
    !sickLeave ||
    typeof sickLeave !== "object" ||
    !("startDate" in sickLeave) ||
    !("endDate" in sickLeave)
  ) {
    throw new Error("Incorrect or missing data");
  }
  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate),
  };
};

const parseHealthCheck = (healthCheckRating: unknown): HealthCheckRating => {
  if (
    !healthCheckRating ||
    !isNumber(healthCheckRating) ||
    !isHealthCheck(healthCheckRating)
  ) {
    throw new Error(
      `Incorrect Health Rating: ${healthCheckRating}, should be a number in the range of 1 - 4`,
    );
  }
  return healthCheckRating;
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object" || !("type" in object)) {
    throw new Error("Incorrect or missing data");
  }

  if (
    !("description" in object && "date" in object && "specialist" in object)
  ) {
    throw new Error("Incorrect or missing data");
  }

  switch (object.type) {
    case "Hospital":
      if ("discharge" in object) {
        return {
          type: object.type,
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          discharge: parseDischarge(object.discharge),
          diagnosisCodes: parseDiagnosisCodes(object),
        };
      } else {
        throw new Error("Incorrect or missing data");
      }
    case "OccupationalHealthcare":
      if ("sickLeave" in object && "employerName" in object) {
        return {
          type: object.type,
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          sickLeave: parseSickLeave(object.sickLeave),
          employerName: parseName(object.employerName),
          diagnosisCodes: parseDiagnosisCodes(object),
        };
      } else {
        throw new Error("Incorrect or missing data");
      }
    case "HealthCheck":
      if ("healthCheckRating" in object) {
        return {
          type: object.type,
          description: parseDescription(object.description),
          date: parseDate(object.date),
          specialist: parseSpecialist(object.specialist),
          healthCheckRating: parseHealthCheck(object.healthCheckRating),
          diagnosisCodes: parseDiagnosisCodes(object),
        };
      } else {
        throw new Error("Incorrect or missing data");
      }
    default:
      throw new Error("Invalid entry type");
  }
};
