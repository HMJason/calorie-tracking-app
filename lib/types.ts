export interface MacroNutrients {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  fiber?: number;  // grams
  sugar?: number;  // grams
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroNutrients;
  servingSize: number;   // grams
  servingUnit: string;
  imageUrl?: string;
  timestamp: string;     // ISO string
  mealType: MealType;
}

export interface DailyLog {
  date: string;          // YYYY-MM-DD
  meals: FoodItem[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  calorieGoal: number;
}

export interface DayDataPoint {
  date: string;          // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WeeklyData {
  weekStart: string;     // YYYY-MM-DD (Monday)
  days: DayDataPoint[];
  averageCalories: number;
  totalCalories: number;
}

export interface MonthlyData {
  year: number;
  month: number;         // 1-12
  days: DayDataPoint[];
  averageCalories: number;
  totalCalories: number;
}

export interface MonthDataPoint {
  month: string;         // e.g. "Jan"
  averageCalories: number;
  totalCalories: number;
}

export interface YearlyData {
  year: number;
  months: MonthDataPoint[];
  averageCalories: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dailyCalorieGoal: number;
  macroGoals: MacroNutrients;
  avatar?: string;
}

export interface AnalysisResult {
  foodItem: FoodItem;
  confidence: number;    // 0-1
  alternatives?: Pick<FoodItem, 'name' | 'calories' | 'macros'>[];
}

export interface ChartDataPoint {
  label: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}
