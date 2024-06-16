interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((day) => day > 0).length;
  const totalHours = dailyHours.reduce((acc, cur) => acc + cur, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'Onnistuit';
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = 'Meh';
  } else {
    rating = 1;
    ratingDescription = 'Sami';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Target then hours');
  process.exit(1);
}

const target = Number(args[0]);
const dailyHours = args.slice(1).map(Number);

if (isNaN(target) || dailyHours.some(isNaN)) {
  console.log(
    'They need to be numbers'
  );
  process.exit(1);
}

const result = calculateExercises(dailyHours, target);
console.log(result);
