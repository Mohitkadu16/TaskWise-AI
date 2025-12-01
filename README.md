# TaskWise-AI 🚀

**AI-Powered Task Management & Evaluation System**

A modern full-stack web application built with Next.js 15, Supabase, and Tailwind CSS.

## ✨ Features

- 🔐 **Secure Authentication** - Email/password login with Supabase Auth
- 📊 **Task Management** - Create, read, update, and delete tasks
- 👥 **User Profiles** - Manage user information and preferences
- 💳 **Payment Tracking** - Track transactions and payments
- 🤖 **AI Evaluation** - AI-powered task evaluation and analysis
- 🔒 **Row Level Security** - Automatic data isolation per user
- 📱 **Responsive Design** - Beautiful UI built with Shadcn/UI and Tailwind
- ⚡ **Type-Safe** - Full TypeScript support

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **AI Integration**: Google Genkit
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth

## 📦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier available at https://supabase.com)

### Installation

1. **Clone & Install**
```bash
git clone <repository>
cd TaskWise-AI
npm install
```

2. **Configure Environment**
```bash
# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
```

3. **Set Up Database**
- See `SUPABASE_SETUP.md` for detailed SQL setup instructions
- Creates `users`, `tasks`, and `payments` tables with RLS enabled

4. **Create Test User**
- Email: `team@example.com`
- Password: `password`

5. **Start Development Server**
```bash
npm run dev
```

Visit http://localhost:9002 and log in!

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | 5-minute setup guide |
| **SUPABASE_SETUP.md** | Detailed database configuration |
| **ARCHITECTURE.md** | System design & patterns |
| **INTEGRATION_SUMMARY.md** | Complete integration overview |
| **CHECKLIST.md** | Implementation checklist |

**Start with QUICKSTART.md!**

## 🚀 Quick Start

### Login Page
- Navigate to `/login`
- Use test credentials: `team@example.com` / `password`

### Dashboard
- View and manage your tasks
- Create new tasks
- Track task status and priority

### Profile
- View and edit your profile
- Update personal information

### Payments
- View payment history
- Track transactions

### AI Evaluation
- Evaluate tasks using AI
- Get insights and recommendations

## 📂 Project Structure

```
src/
├── app/                        # Next.js app directory
│   ├── (auth)/                # Auth routes
│   │   └── login/page.tsx     # Login page
│   ├── (app)/                 # Protected routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── profile/           # User profile
│   │   ├── payments/          # Payment tracking
│   │   ├── ai-evaluation/     # AI evaluation
│   │   └── task/[id]/         # Task details
│   └── layout.tsx             # Root layout
├── lib/
│   ├── supabase/
│   │   └── server.ts          # Server-side client
│   ├── supabaseClient.ts      # Browser client
│   ├── auth.ts                # Auth functions
│   ├── database.ts            # Database operations
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── layout/                # Layout components
│   ├── tasks/                 # Task-related components
│   └── examples/              # Example components
├── middleware.ts              # Route protection
└── hooks/                     # React hooks
```

## 🔐 Security Features

- **Row Level Security**: Users can only access their own data
- **Protected Routes**: Middleware checks authentication
- **Secure Sessions**: httpOnly cookies for session storage
- **Type Safety**: Full TypeScript coverage
- **Server Actions**: All data access server-side

## 📊 Database Schema

### Users Table
- `id` (UUID) - User ID from Supabase Auth
- `email` (VARCHAR) - User email
- `full_name` (VARCHAR) - User's full name
- `avatar_url` (TEXT) - Avatar image URL
- `created_at` (TIMESTAMP) - Creation date
- `updated_at` (TIMESTAMP) - Last update

### Tasks Table
- `id` (UUID) - Task ID
- `user_id` (UUID) - Owner's user ID
- `title` (VARCHAR) - Task title
- `description` (TEXT) - Task description
- `status` (VARCHAR) - 'To Do' | 'In Progress' | 'Done'
- `priority` (VARCHAR) - 'Low' | 'Medium' | 'High'
- `due_date` (DATE) - Due date
- `assignee_id` (UUID) - Assigned user ID
- `created_at` (TIMESTAMP) - Creation date
- `updated_at` (TIMESTAMP) - Last update

### Payments Table
- `id` (UUID) - Payment ID
- `user_id` (UUID) - User who made payment
- `amount` (DECIMAL) - Payment amount
- `status` (VARCHAR) - 'pending' | 'completed' | 'failed'
- `description` (TEXT) - Payment description
- `created_at` (TIMESTAMP) - Creation date
- `updated_at` (TIMESTAMP) - Last update

## 💻 API Reference

### Authentication
```typescript
import { handleLogin, handleLogout, getCurrentUser } from '@/lib/auth';

// Login with email/password
await handleLogin(formData);

// Logout current user
await handleLogout();

// Get current authenticated user
const user = await getCurrentUser();
```

### Tasks
```typescript
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/database';

// Get all user tasks
const tasks = await getTasks();

// Create new task
const task = await createTask({ title, description, status, priority });

// Update task
await updateTask(taskId, { status: 'Done' });

// Delete task
await deleteTask(taskId);
```

### User Profile
```typescript
import { getUserProfile, updateUserProfile } from '@/lib/database';

// Get user profile
const profile = await getUserProfile();

// Update profile
await updateUserProfile({ full_name, avatar_url });
```

### Payments
```typescript
import { getPayments, createPayment } from '@/lib/database';

// Get user payments
const payments = await getPayments();

// Create payment
const payment = await createPayment({ amount, status, description });
```

## 🔄 Available Scripts

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# AI development server
npm run genkit:dev

# Watch AI changes
npm run genkit:watch
```

## 🧪 Testing

To test the authentication flow:

1. Visit http://localhost:9002/login
2. Enter test credentials:
   - Email: `team@example.com`
   - Password: `password`
3. Should redirect to `/dashboard`
4. View your tasks from the database

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
1. Set environment variables in your platform
2. Run `npm run build`
3. Deploy the `.next` directory

**Note**: Make sure to set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your deployment platform's environment variables.

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Login Not Working
- Verify test user exists in Supabase
- Check environment variables are set
- Look for errors in browser console

### Database Errors
- Run SQL from `SUPABASE_SETUP.md` again
- Verify RLS policies are enabled
- Check user_id in database

### Build Errors
- Run `npm install` to ensure dependencies
- Clear `.next` folder: `rm -rf .next`
- Check TypeScript errors: `npm run typecheck`

## 📚 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)
- [Google Genkit](https://firebase.google.com/docs/genkit)

## 📞 Support

For issues and questions:
1. Check the documentation files
2. Review existing GitHub issues
3. Create a new issue with details

## 🎉 Acknowledgments

Built with:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)
- [Google Genkit](https://firebase.google.com/docs/genkit)

---

**Ready to get started?** Follow the steps in QUICKSTART.md! 🚀
