/**
 * Mock data for frontend demo.
 * Replace with real API calls (lib/api.ts) when backend is connected.
 */

import type {
  ChartDataPoint,
  DailyLog,
  DayDataPoint,
  FoodItem,
  MonthDataPoint,
  UserProfile,
} from './types';

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Jason',
  email: 'jason@example.com',
  dailyCalorieGoal: 2000,
  macroGoals: { protein: 150, carbs: 250, fat: 65 },
};

// ---------------------------------------------------------------------------
// Today's meals
// ---------------------------------------------------------------------------

export const mockMeals: FoodItem[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 350,
    macros: { protein: 12, carbs: 62, fat: 6 },
    servingSize: 300,
    servingUnit: 'g',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
    mealType: 'breakfast',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 520,
    macros: { protein: 42, carbs: 28, fat: 24 },
    servingSize: 400,
    servingUnit: 'g',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    mealType: 'lunch',
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    calories: 180,
    macros: { protein: 18, carbs: 20, fat: 3 },
    servingSize: 200,
    servingUnit: 'g',
    timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    mealType: 'snack',
  },
  {
    id: '4',
    name: 'Salmon with Rice',
    calories: 580,
    macros: { protein: 45, carbs: 60, fat: 14 },
    servingSize: 450,
    servingUnit: 'g',
    timestamp: new Date(Date.now() - 0.5 * 3600000).toISOString(),
    mealType: 'dinner',
  },
];

export const mockDailyLog: DailyLog = {
  date: new Date().toISOString().split('T')[0],
  meals: mockMeals,
  totalCalories: mockMeals.reduce((s, m) => s + m.calories, 0),
  totalMacros: {
    protein: mockMeals.reduce((s, m) => s + m.macros.protein, 0),
    carbs: mockMeals.reduce((s, m) => s + m.macros.carbs, 0),
    fat: mockMeals.reduce((s, m) => s + m.macros.fat, 0),
  },
  calorieGoal: 2000,
};

// ---------------------------------------------------------------------------
// Weekly (last 7 days)
// ---------------------------------------------------------------------------

export const mockWeeklyData: ChartDataPoint[] = [
  { label: 'Mon', calories: 1850, protein: 130, carbs: 220, fat: 58 },
  { label: 'Tue', calories: 2100, protein: 145, carbs: 260, fat: 65 },
  { label: 'Wed', calories: 1650, protein: 115, carbs: 198, fat: 50 },
  { label: 'Thu', calories: 2200, protein: 158, carbs: 270, fat: 68 },
  { label: 'Fri', calories: 1900, protein: 140, carbs: 235, fat: 57 },
  { label: 'Sat', calories: 2400, protein: 165, carbs: 295, fat: 74 },
  { label: 'Sun', calories: mockDailyLog.totalCalories, protein: mockDailyLog.totalMacros.protein, carbs: mockDailyLog.totalMacros.carbs, fat: mockDailyLog.totalMacros.fat },
];

// ---------------------------------------------------------------------------
// Monthly (daily points for current month)
// ---------------------------------------------------------------------------

const daysInMonth = 28;
export const mockMonthlyData: DayDataPoint[] = Array.from({ length: daysInMonth }, (_, i) => {
  const base = 1800;
  const variation = Math.sin(i * 0.8) * 300 + (Math.random() * 200 - 100);
  const cal = Math.round(base + variation);
  return {
    date: `Day ${i + 1}`,
    calories: cal,
    protein: Math.round(cal * 0.25 / 4),
    carbs: Math.round(cal * 0.45 / 4),
    fat: Math.round(cal * 0.30 / 9),
  };
});

// ---------------------------------------------------------------------------
// Yearly (monthly averages)
// ---------------------------------------------------------------------------

export const mockYearlyData: MonthDataPoint[] = [
  { month: 'Jan', averageCalories: 1850, totalCalories: 57350 },
  { month: 'Feb', averageCalories: 1920, totalCalories: 53760 },
  { month: 'Mar', averageCalories: 2050, totalCalories: 63550 },
  { month: 'Apr', averageCalories: 1780, totalCalories: 53400 },
  { month: 'May', averageCalories: 2100, totalCalories: 65100 },
  { month: 'Jun', averageCalories: 2200, totalCalories: 66000 },
  { month: 'Jul', averageCalories: 2150, totalCalories: 66650 },
  { month: 'Aug', averageCalories: 1950, totalCalories: 60450 },
  { month: 'Sep', averageCalories: 1800, totalCalories: 54000 },
  { month: 'Oct', averageCalories: 2000, totalCalories: 62000 },
  { month: 'Nov', averageCalories: 2100, totalCalories: 63000 },
  { month: 'Dec', averageCalories: 2250, totalCalories: 69750 },
];
