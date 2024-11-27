import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Diagnose } from "../types.ts";

export const getAllDiagnoses = async () => {
  const { data } = await axios.get<Diagnose[]>(`${apiBaseUrl}/diagnoses`);

  return data;
};
