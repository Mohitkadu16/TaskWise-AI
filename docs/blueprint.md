# **App Name**: TaskWise AI

## Core Features:

- Login Page: Email and password form with placeholder handleLogin() for Supabase integration.
- Dashboard Page: Display all tasks in a Trello-like board for the logged-in user with task lists and Add/Edit/Delete Task buttons.
- Task Creation/Edit Modal: Modal form with fields for title, description, status (dropdown), assignee email, priority, and due date.
- AI Evaluation Page: Text area for task content, dropdown to select AI provider (OpenAI, Groq, Gemini, Claude, Ollama), and an 'Evaluate Task' button with a placeholder handleEvaluateTask(provider) function to display AI Score, reasons, and suggestions.
- AI-Powered Evaluation: Using a selected AI provider, evaluate the task content for completeness, clarity, and feasibility, providing an AI score, reasons for the score, and suggestions for improvement using reasoning as a tool.
- Payments Page: Basic UI to show the current plan (Free/Pro) and a button for 'Upgrade to Pro'.
- User Profile Page: Display user's name, email, edit profile and logout buttons using placeholder handleLogout() function.

## Style Guidelines:

- Primary color: Deep sky blue (#42A5F5) to represent clarity and focus.
- Background color: Very light blue (#E3F2FD) to provide a calm, uncluttered backdrop.
- Accent color: Lavender (#D1C4E9) to highlight interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for its modern, neutral look suitable for both headlines and body text.
- Simple, clear icons from a set like Material Design Icons to represent task status and actions.
- Clean, card-based layout for tasks on the dashboard, following a Trello-style board with columns for different task statuses.
- Subtle animations for transitions and feedback, like fading in/out modals and highlighting updated task cards.