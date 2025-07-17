# 💰 ExpenseTracker

A modern expense tracking application built with React and Supabase, featuring real-time updates, comprehensive reporting, and secure authentication.

## 🚀 Key Features

- 📊 **Financial Dashboard**: Real-time overview of income, expenses, and savings
- 💳 **Transaction Management**: Easy expense and income tracking
- 📈 **Reports & Analytics**: Visual insights into spending patterns
- 🔐 **Secure Authentication**: Email/password and Google OAuth support
- 📱 **Responsive Design**: Works seamlessly across all devices

## 🛠️ Tech Stack

- Frontend: React 18, Vite, Recharts
- Backend: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Styling: Tailwind CSS

## ⚡ Quick Start

1. **Clone and Install**
   ```bash
   git clone https://github.com/harshitbhatt18/SpendAudit.git
   cd SpendAudit
   npm install
   ```

2. **Configure Environment**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Setup Database**
   - Run `supabase-setup.sql` in Supabase SQL Editor
   - For existing installations: run `guide-progress-migration.sql`

4. **Start Development**
   ```bash
   npm run dev
   ```
