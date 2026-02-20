# CaloriAI 🔥

A premium AI-powered calorie and nutrition tracking web application. Snap a photo of your food and let AI analyse its nutritional content — then track your daily intake with a beautifully designed dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-11-orange?logo=firebase)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- **AI Food Analysis** — Upload a photo of any meal and get instant calorie and macro estimates powered by the Anthropic Claude API
- **Dashboard** — At-a-glance view of daily calories, protein, carbs, and fat with progress rings and bars
- **Analytics** — Daily, weekly, monthly, and yearly views with interactive charts (Recharts)
- **Authentication** — Email/password sign-in and sign-up via Firebase Auth
- **Meal Logging** — Log meals by type (breakfast, lunch, dinner, snack) with timestamps
- **Macro Tracking** — Detailed breakdown of protein, carbohydrates, fat, fibre, and sugar
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop
- **Glassmorphism UI** — Premium dark-mode design with vibrant gradients and smooth animations

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS with CSS Custom Properties (design system) |
| Auth & Database | [Firebase](https://firebase.google.com/) (Auth + Firestore) |
| AI Analysis | [Anthropic Claude API](https://www.anthropic.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | CSS keyframes + Framer Motion |

---

## 📁 Project Structure

```
calorie-tracking-app/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Main dashboard
│   ├── layout.tsx              # Root layout with sidebar
│   ├── globals.css             # Global styles & design system tokens
│   ├── analytics/
│   │   └── page.tsx            # Analytics page (daily/weekly/monthly/yearly)
│   ├── log/
│   │   └── page.tsx            # Meal log page
│   ├── login/
│   │   └── page.tsx            # Authentication page (sign in / sign up)
│   ├── settings/
│   │   └── page.tsx            # User settings & goals
│   └── api/
│       └── analyze-food/       # API route for AI food analysis
├── components/
│   ├── analytics/
│   │   ├── DailyView.tsx       # Daily nutrition breakdown
│   │   ├── WeeklyView.tsx      # Weekly calorie bar chart
│   │   ├── MonthlyView.tsx     # Monthly trend line chart + heatmap
│   │   └── YearlyView.tsx      # Yearly overview / contribution graph
│   ├── ui/
│   │   ├── Card.tsx            # Reusable glassmorphism card
│   │   └── Button.tsx          # Styled button variants
│   ├── AuthGuard.tsx           # Route protection wrapper
│   ├── ImageUpload.tsx         # Drag-and-drop food photo uploader
│   └── Layout.tsx              # Sidebar + main layout shell
├── lib/
│   ├── firebase.ts             # Firebase initialisation
│   ├── authContext.tsx         # React auth context & provider
│   ├── api.ts                  # API helper functions
│   ├── types.ts                # TypeScript interfaces & types
│   └── mockData.ts             # Mock data for UI development
├── plan/                       # Project planning documents
│   ├── implementation_plan.md  # Full implementation plan
│   ├── task.md                 # Task breakdown
│   └── VERIFICATION.md        # Verification checklist
├── .env.local                  # Environment variables (not committed)
├── firebase.json               # Firebase hosting config
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore index definitions
└── next.config.js              # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Firebase](https://firebase.google.com/) project with **Authentication** and **Firestore** enabled
- An [Anthropic](https://www.anthropic.com/) API key

### 1. Clone the repository

```bash
git clone https://github.com/hmjason/calorie-tracking-app.git
cd calorie-tracking-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Anthropic (server-side only — do NOT prefix with NEXT_PUBLIC_)
ANTHROPIC_API_KEY=sk-ant-...
```

> ⚠️ Never commit `.env.local` to version control. It is already included in `.gitignore`.

### 4. Set up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project
2. Enable **Email/Password** authentication under Authentication → Sign-in method
3. Create a **Firestore database** in production mode
4. Copy your Firebase config values into `.env.local`

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema (Firestore)

```
users/
  {userId}/
    email: string
    createdAt: timestamp
    profile:
      name: string
      dailyCalorieGoal: number
      macroGoals:
        protein: number  (grams)
        carbs: number    (grams)
        fat: number      (grams)
    dailyLogs/
      {dateISO}/          # e.g. "2025-01-15"
        date: string
        totalCalories: number
        totalProtein: number
        totalCarbs: number
        totalFat: number
        meals: [
          {
            id: string
            name: string
            mealType: "breakfast" | "lunch" | "dinner" | "snack"
            calories: number
            macros: { protein, carbs, fat, fiber?, sugar? }
            imageUrl?: string
            timestamp: timestamp
            servingSize: number
            servingUnit: string
          }
        ]
```

---

## 🔐 Firestore Security Rules

The app includes Firestore security rules that ensure users can only read and write their own data:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy rules with:

```bash
firebase deploy --only firestore:rules
```

---

## 🤖 AI Food Analysis

The `/api/analyze-food` endpoint accepts an image upload and uses the **Anthropic Claude API** (vision capability) to:

1. Identify the food items in the image
2. Estimate portion sizes
3. Return calorie count and macro breakdown (protein, carbs, fat)
4. Provide confidence scores and alternative estimates

The response is mapped to the `AnalysisResult` type and logged to Firestore.

---

## 📊 Analytics Views

| View | Description |
|---|---|
| **Daily** | Macro donut chart, calorie progress ring, meal-by-meal timeline |
| **Weekly** | Bar chart comparing calories across the past 7 days |
| **Monthly** | Line chart for calorie trends + calendar heatmap for logging consistency |
| **Yearly** | Monthly average bars and annual contribution graph |

---

## 🎨 Design System

The app uses a custom CSS design system defined in `globals.css` via CSS custom properties:

```css
/* Colours */
--accent-purple: #7c3aed
--accent-cyan: #06b6d4
--accent-green: #10b981
--accent-amber: #f59e0b

/* Backgrounds */
--bg-primary: #0f0c29
--bg-secondary: #1a1740
--glass-bg: rgba(255, 255, 255, 0.05)

/* Glassmorphism */
--glass-border: rgba(255, 255, 255, 0.1)
--backdrop-blur: blur(20px)
```

---

## 📋 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🗺️ Roadmap

- [ ] Connect AI food analysis to live Firestore logging
- [ ] Real user profile data (replace mock data)
- [ ] Image upload to Firebase Storage
- [ ] Push notifications for meal reminders
- [ ] Barcode scanner for packaged foods
- [ ] Export data to CSV
- [ ] Social sharing of streaks / milestones
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
