import express from 'express';
import { calculateExercises } from './exerciseWebCalculator';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { dailyExercises, target }: any = req.body;

  if (target === undefined || dailyExercises === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (
    !Array.isArray(dailyExercises) ||
    dailyExercises.some((day) => isNaN(Number(day))) ||
    isNaN(Number(target))
  ) {
    return res.status(400).json({ error: 'malformated parameters' });
  }

  const dailyHours = dailyExercises.map(Number);
  const targetNumber = Number(target);

  const result = calculateExercises(dailyHours, targetNumber);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
