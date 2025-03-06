# Mission Management System

A secure, role-based mission management application built with React, TypeScript, and Supabase.

## 👥 Authors

- [@philanderson888](https://github.com/philanderson888) - Project Lead & Developer
- [Bolt](https://bolt.new) - AI Development Partner

## 📅 Project Timeline

- **Created**: March 2025
- **Last Updated**: March 2025

## 🔗 Code

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/philanderson888/gospel-for-asia-messaging-system)

## 🚀 Features

### Authentication & Authorization
- ✅ Secure user registration with email and password
- ✅ Protected routes with role-based access control
- ✅ Automatic session management and token refresh
- ✅ Forced login for authenticated routes

### User Management
- ✅ Three distinct user roles:
  - Administrators
  - Missionaries
  - Sponsors
- ✅ Approval workflow for new users
- ✅ Role-specific dashboards and permissions

### Access Control
- ✅ Unapproved users:
  - Can access dashboard
  - See pending approval status
  - Limited functionality until approved
- ✅ Approved missionaries:
  - Full access to missionary dashboard
  - Role-specific features (coming soon)
- ✅ Approved sponsors:
  - Full access to sponsor dashboard
  - Role-specific features (coming soon)
- ✅ Approved administrators:
  - Access to user management
  - Real-time user statistics
  - Ability to manage other users

### Dashboard Features
- ✅ Real-time user statistics for administrators:
  - Count of approved administrators
  - Count of approved missionaries
  - Count of approved sponsors
  - Count of pending approvals
- ✅ Role-specific welcome messages
- ✅ Clean, intuitive interface

## 🛠️ Technical Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: React Context
- **Routing**: React Router
- **Notifications**: React Hot Toast

## 🔒 Security Features

- Secure session management
- Protected API routes
- Role-based access control (RBAC)
- Database row-level security (RLS)
- Secure password handling

## 🌱 Project Status

The project is under active development. Core authentication and authorization features are complete, with role-specific features coming soon.

### Coming Soon
- Missionary-specific features
- Sponsor-specific features
- Enhanced administrator tools
- Reporting and analytics
- Communication features

## 💻 Development

The project uses modern development practices:
- TypeScript for type safety
- ESLint for code quality
- Vite for fast development and building
- Tailwind CSS for utility-first styling

More documentation will be added as new features are developed.