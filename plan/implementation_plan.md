# Implementation Plan - Calorie Tracking App

This plan focuses on creating a high-quality, modern frontend for the calorie tracking application, prioritizing user experience and visual design. The backend implementation is deferred as per your instructions only to prepare the necessary structures for future integration.

## Goal Description
Create a premium, visually stunning web application for tracking calorie intake through image analysis. The app will feature a sleek dashboard with detailed analytics (Daily, Weekly, Monthly, Yearly) and an intuitive image upload interface. The design will emphasize modern aesthetics like glassmorphism, vibrant gradients, and smooth animations.

## Backend Schema (Firebase)
### Authentication
- **Provider**: Email/Password
- **Users Collection**: `users/{userId}`
    - `email`: string
    - `createdAt`: timestamp
    - `profile`: object (name, goals, etc.)

### Firestore Collections
- **Daily Logs**: `users/{userId}/dailyLogs/{dateISO}`
    - `date`: string (YYYY-MM-DD)
    - `totalCalories`: number
    - `totalProtein`: number
    - `totalCarbs`: number
    - `totalFat`: number
    - `meals`: array of objects
        - `imageUrl`: string
        - `name`: string
        - `calories`: number
        - `nutrients`: object (protein, carbs, fat)
        - `timestamp`: timestamp

- **Analytics Aggregates** (Optional - calculated on the fly or via scheduled functions):
    - `users/{userId}/stats/weekly`
    - `users/{userId}/stats/monthly`
    - `users/{userId}/stats/yearly`

## User Review Required
> [!IMPORTANT]
> **Design Direction Confirmation**: Please confirm if the proposed "Glassmorphism & Vibrant Gradients" aesthetic aligns with your vision of "super modern". We will use Vanilla CSS with CSS Variables/Tokens to implement a custom design system for maximum flexibility.

## Proposed Architecture
- **Framework**: Next.js (App Router) for robust routing and server-side rendering capabilities.
- **Styling**: Vanilla CSS with a strict Design System (CSS Variables for colors, spacing, typography). No Tailwind CSS to maintain custom, premium styling control.
- **State Management**: React Context / Hooks for managing user data and analytics state.
- **Charts**: Recharts or Chart.js for beautiful, interactive data visualization.

## Proposed Changes

### Project Structure & Setup
#### [NEW] [package.json](file:///package.json)
- Initialize Next.js project with TypeScript.
- Add dependencies: `lucide-react` (icons), `recharts` (charts), `framer-motion` (animations).

#### [NEW] [next.config.js](file:///next.config.js)
- Standard Next.js configuration.

### Design System & Global Styles
#### [NEW] [globals.css](file:///app/globals.css)
- Define CSS Variables for the "Premium" theme:
    - **Colors**: Deep dark background (`#0f0c29`, `#302b63`, `#24243e`), vibrant accents (Neons, Gradients).
    - **Glassmorphism**: Classes for backdrop-filter, semi-transparent backgrounds.
    - **Typography**: Inter or outfit font family.
    - **Animations**: Keyframes for fade-in, slide-up, hover effects.

### Core Components
#### [NEW] [components/ui/Card.tsx](file:///components/ui/Card.tsx)
- Reusable "Glass" card component for consistency.

#### [NEW] [components/ui/Button.tsx](file:///components/ui/Button.tsx)
- Premium button styles with gradients and hover effects.

#### [NEW] [components/ImageUpload.tsx](file:///components/ImageUpload.tsx)
- Drag-and-drop zone with visual feedback.
- Preview functionality for uploaded food images.

### Features & Pages
#### [NEW] [app/page.tsx](file:///app/page.tsx)
- Landing / Dashboard overview.
- Quick actions (Add Food).

#### [NEW] [app/analytics/page.tsx](file:///app/analytics/page.tsx)
- Main Analytics Dashboard.
- Tab/Toggle system for Daily, Weekly, Monthly, Yearly views.

#### [NEW] [components/analytics/DailyView.tsx](file:///components/analytics/DailyView.tsx)
- Macros breakdown chart (Protein, Fat, Carbs).
- Calorie progress ring.

#### [NEW] [components/analytics/WeeklyView.tsx](file:///components/analytics/WeeklyView.tsx)
- Bar chart showing calorie intake over the week.

#### [NEW] [components/analytics/MonthlyView.tsx](file:///components/analytics/MonthlyView.tsx)
- Line chart for weight/calorie trends.
- Calendar heatmap for activity/logging consistency.

#### [NEW] [components/analytics/YearlyView.tsx](file:///components/analytics/YearlyView.tsx)
- High-level contribution graph or monthly averages.

## Verification Plan

### Automated Tests
- Build verification: Run `npm run build` to ensure all components compile correctly.
- Linting: Run `npm run lint` to check code quality.

### Manual Verification
1. **Visual Inspection**: Verify the "Glassmorphism" effect and responsiveness on different screen sizes.
2. **Interaction Testing**:
    - Test drag-and-drop functionality for image upload.
    - Click through all analytics tabs (Daily -> Weekly -> Monthly -> Yearly) to ensure smooth transitions.
    - Verify charts render with dummy data (since backend is pending).
