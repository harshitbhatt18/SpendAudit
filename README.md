# SpendAudit

A modern expense tracking application built with React and Supabase, featuring real-time updates, comprehensive reporting, and secure authentication.

## Key Features

- **Financial Dashboard**: Real-time overview of income, expenses, and savings
- **Transaction Management**: Easy expense and income tracking
- **Reports & Analytics**: Visual insights into spending patterns with Recharts
- **Secure Authentication**: Email/password and Google OAuth support
- **Responsive Design**: Works seamlessly across all devices
- **User Guides**: Interactive onboarding guides with progress tracking

## Tech Stack

- **Frontend**: React 19, Vite 7, Recharts
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/harshitbhatt18/SpendAudit.git
cd SpendAudit
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project URL and anon key (found in your [Supabase dashboard](https://supabase.com/dashboard) under Project Settings > API):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database

Run these SQL files in the [Supabase SQL Editor](https://supabase.com/dashboard) in order:

1. `supabase-setup.sql` — Creates `user_preferences` table, RLS policies, and auth trigger
2. `expenses-table-setup.sql` — Creates `expenses` table with RLS policies
3. `guide-progress-migration.sql` *(optional)* — Adds guide progress tracking for existing installations

### 4. Start Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.


## Project Structure

```
src/
├── main.jsx                  # App bootstrap
├── App.jsx                   # Router and providers
├── index.css                 # Tailwind CSS entry
├── contexts/
│   ├── supabaseClient.js     # Supabase client initialization
│   ├── AuthContext.jsx       # Authentication state management
│   └── ExpenseContext.jsx    # Expense data management
└── Components/
    ├── Login.jsx             # Login page
    ├── Signup.jsx            # Registration page
    ├── Dashboard.jsx         # Main dashboard layout
    ├── ProtectedRoute.jsx    # Auth route guard
    ├── ErrorBoundary.jsx     # Graceful error handling
    ├── NotFound.jsx          # 404 page
    ├── Loading.jsx           # Loading spinner
    ├── AddExpenseModal.jsx   # Add transaction modal
    └── SidebarComponents/
        ├── TransactionHistory.jsx
        ├── Reports.jsx
        ├── Settings.jsx
        ├── Guides.jsx
        └── Help.jsx
```
