export interface BmiResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  color: string;
  badgeBg: string;
  idealWeightRange: { min: number; max: number };
}

export function calculateBMI(heightCm: number, weightKg: number): BmiResult | null {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return null;
  }

  const heightM = heightCm / 100;
  const bmiValue = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  // Ideal weight range for normal BMI (18.5 - 24.9)
  const minIdeal = parseFloat((18.5 * heightM * heightM).toFixed(1));
  const maxIdeal = parseFloat((24.9 * heightM * heightM).toFixed(1));

  let category: BmiResult['category'] = 'Normal weight';
  let color = 'text-emerald-700';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (bmiValue < 18.5) {
    category = 'Underweight';
    color = 'text-amber-700';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (bmiValue >= 18.5 && bmiValue < 25) {
    category = 'Normal weight';
    color = 'text-emerald-700';
    badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (bmiValue >= 25 && bmiValue < 30) {
    category = 'Overweight';
    color = 'text-orange-700';
    badgeBg = 'bg-orange-50 text-orange-700 border-orange-200';
  } else {
    category = 'Obese';
    color = 'text-rose-700';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return {
    bmi: bmiValue,
    category,
    color,
    badgeBg,
    idealWeightRange: { min: minIdeal, max: maxIdeal },
  };
}
