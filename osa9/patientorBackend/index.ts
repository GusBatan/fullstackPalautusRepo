import cors from "cors";
import express from "express";
import patients from "./routes/patients";
import diagnoses from "./routes/diagnoses";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/patients", patients);
app.use("/api/diagnoses", diagnoses);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
