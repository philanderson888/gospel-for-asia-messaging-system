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

## 🎯 Project Goals

The Mission Management System aims to modernize and streamline communication between sponsors and their sponsored children. Key objectives include:

- Replacing traditional paper-based communication with a secure digital platform
- Enabling faster, more efficient communication between sponsors and children
- Maintaining system integrity through verified sponsor registration
- Supporting missionaries in their communication and coordination efforts

### Sponsor Registration Process

To ensure system security and data integrity, sponsors must complete a verification process:

1. Sponsors receive a welcome letter containing:
   - A unique Sponsor ID
   - Their sponsored Child's ID
2. These IDs must be provided during registration
3. This two-factor verification helps prevent unauthorized access
4. Only verified sponsors can access the communication platform

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
  - Count of administrators
  - Count of missionaries
  - Count of sponsors
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
- Two-factor verification for sponsors (Sponsor ID + Child ID)

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