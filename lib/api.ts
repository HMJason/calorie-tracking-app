/**
 * API Service Layer
 * Structured for future backend integration.
 * All functions are async and return typed promises.
 * Replace the stub implementations with real HTTP calls when the backend is ready.
 */

import type {
  AnalysisResult,
  DailyLog,
  FoodItem,
  MonthlyData,
  UserProfile,
  WeeklyData,
  YearlyData,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Food Image Analysis
// ---------------------------------------------------------------------------

/**
 * Send a food image to the backend for AI-powered nutritional analysis.
 */
export async function analyzeFoodImage(imageFile: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('image', imageFile);

  // TODO: replace stub with real fetch when backend is ready
  // return request<AnalysisResult>('/analyze', { method: 'POST', body: formData, headers: {} });
  throw new Error('Backend not yet implemented – connect to AI analysis endpoint.');
}

// ---------------------------------------------------------------------------
// Daily Logs
// ---------------------------------------------------------------------------

export async function getDailyLog(date: string): Promise<DailyLog> {
  return request<DailyLog>(`/logs/${date}`);
}

export async function addFoodItem(
  date: string,
  food: Omit<FoodItem, 'id'>,
): Promise<FoodItem> {
  return request<FoodItem>(`/logs/${date}/items`, {
    method: 'POST',
    body: JSON.stringify(food),
  });
}

export async function updateFoodItem(
  date: string,
  foodId: string,
  updates: Partial<FoodItem>,
): Promise<FoodItem> {
  return request<FoodItem>(`/logs/${date}/items/${foodId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function deleteFoodItem(date: string, foodId: string): Promise<void> {
  await request<void>(`/logs/${date}/items/${foodId}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function getWeeklyData(weekStart: string): Promise<WeeklyData> {
  return request<WeeklyData>(`/analytics/weekly?start=${weekStart}`);
}

export async function getMonthlyData(year: number, month: number): Promise<MonthlyData> {
  return request<MonthlyData>(`/analytics/monthly?year=${year}&month=${month}`);
}

export async function getYearlyData(year: number): Promise<YearlyData> {
  return request<YearlyData>(`/analytics/yearly?year=${year}`);
}

// ---------------------------------------------------------------------------
// User Profile
// ---------------------------------------------------------------------------

export async function getUserProfile(): Promise<UserProfile> {
  return request<UserProfile>('/profile');
}

export async function updateUserProfile(
  updates: Partial<UserProfile>,
): Promise<UserProfile> {
  return request<UserProfile>('/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}
