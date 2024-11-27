import {
  Box,
  Table,
  TableHead,
  Typography,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { Diagnosis, Patient } from "../../types";
import HealthRatingBar from "../HealthRatingBar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import patientService from "../../services/patients.ts";
import { getAllDiagnoses } from "../../services/diagnoses.ts";

const SinglePatientPage = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      const patientFound = await patientService.getWithId(patientId ?? "");
      setPatient(patientFound);
    };
    void fetchPatient();
    const fetchDiagnosesCodes = async () => {
      const codesFound = await getAllDiagnoses();
      setDiagnoses(codesFound);
    };
    void fetchDiagnosesCodes();
  }, [patientId]);

  if (!patient) {
    return <div>No patient with that Id</div>;
  }

  return (
    <div className="App">
      <Box>
        <Typography align="center" variant="h6">
          Patient list
        </Typography>
      </Box>
      <Table style={{ marginBottom: "1em" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Occupation</TableCell>
            <TableCell>Health Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={patient.id}>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>{patient.occupation}</TableCell>
            <TableCell>
              <HealthRatingBar showText={false} rating={1} />
            </TableCell>
          </TableRow>
          {patient &&
            patient.entries &&
            patient.entries.map((entry) => (
              <TableRow>
                <TableCell>{`${entry.date}: ${entry.description}`}</TableCell>
                <TableCell>
                  <ul>
                    {entry.diagnosisCodes?.map((code) => {
                      const codeName = diagnoses.find(
                        (diagnose) => diagnose.code === code,
                      );
                      return <li>{`${code}: ${codeName?.name}`}</li>;
                    })}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SinglePatientPage;
