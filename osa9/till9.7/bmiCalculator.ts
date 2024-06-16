const bmiCalculator = (cm: number, kg: number): string => {
  const meters = cm / 100;
  const bmi = kg / (meters * meters);

  if (bmi < 16.0) {
    return 'Underweight (Severe thinness)';
  } else if (bmi >= 16.0 && bmi <= 16.9) {
    return 'Underweight (Moderate thinness)';
  } else if (bmi >= 17.0 && bmi <= 18.4) {
    return 'Underweight (Mild thinness)';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return 'Normal range';
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    return 'Overweight (Pre-obese)';
  } else if (bmi >= 30.0 && bmi <= 34.9) {
    return 'Obese (Class I)';
  } else if (bmi >= 35.0 && bmi <= 39.9) {
    return 'Obese (Class II)';
  } else if (bmi >= 40.0) {
    return 'Obese (Class III)';
  } else {
    return 'Invalid BMI';
  }
};

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Give cm and kg');
  process.exit(1);
}

const [height, weight] = args.map(Number);

if (isNaN(height) || isNaN(weight)) {
  console.log('They need to be numbers');
  process.exit(1);
}

console.log(bmiCalculator(height, weight));
