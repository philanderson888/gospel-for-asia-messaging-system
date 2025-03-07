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

## 📖 User Guide

### For Administrators

Administrators have full access to manage users and oversee the system. Here's what you can do:

1. **Dashboard Overview**
   - View real-time statistics for all user types
   - Monitor pending approvals
   - Access management sections for each user type

2. **User Management**
   - Approve or reject new user registrations
   - View and manage administrators
   - View and manage missionaries
   - View and manage sponsors
   - View and manage Bridge of Hope centers
   - Remove users when necessary

3. **Bridge of Hope Center Management**
   - Review and approve Bridge of Hope center registrations
   - Edit center details (name and ID)
   - Monitor center associations with missionaries

4. **Security Features**
   - Approve new administrator requests
   - Monitor user activities
   - Ensure data integrity

### For Missionaries

Missionaries serve at Bridge of Hope centers, providing education and spiritual guidance. Here's how to use the system:

1. **Registration**
   - Sign up as a missionary
   - Optionally provide your Bridge of Hope center details
   - Wait for administrator approval

2. **Profile Management**
   - Update your Bridge of Hope center association
   - Manage your center name and ID
   - View your approval status

3. **Center Association**
   - Link your account to a Bridge of Hope center
   - Update center details when needed
   - Maintain connection with your assigned center

### For Bridge of Hope Centers

Bridge of Hope centers are the physical locations where children receive education and care:

1. **Registration**
   - Register with your center's email address
   - Provide your official Bridge of Hope Center ID (required)
   - Add your center's name
   - Wait for administrator approval

2. **Center Management**
   - Update your center's name and ID when needed
   - Maintain accurate center information
   - Connect with assigned missionaries

### For Sponsors

Sponsors support children through the Bridge of Hope program:

1. **Registration Requirements**
   - Valid email address
   - Sponsor ID (from welcome letter)
   - Child ID (from welcome letter)
   - Both IDs are required for registration

2. **Account Management**
   - View your sponsorship details
   - Maintain your connection to your sponsored child
   - Update your profile information

## 🚀 Features

### Authentication & Authorization
- ✅ Secure user registration with email and password
- ✅ Protected routes with role-based access control
- ✅ Automatic session management and token refresh
- ✅ Forced login for authenticated routes

### User Management
- ✅ Four distinct user roles:
  - Administrators
  - Missionaries
  - Sponsors
  - Bridge of Hope Centers
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
- ✅ Bridge of Hope Centers:
  - Center-specific dashboard
  - Connection with missionaries
  - Role-specific features (coming soon)

### Dashboard Features
- ✅ Real-time user statistics for administrators:
  - Count of administrators
  - Count of missionaries
  - Count of sponsors
  - Count of Bridge of Hope centers
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
- Bridge of Hope Center ID verification

## 🌱 Project Status

The project is under active development. Core authentication, authorization, and user management features are complete, with role-specific features coming soon.

### Coming Soon
- Messaging system between sponsors and Bridge of Hope centers
- Enhanced missionary features
- Expanded sponsor capabilities
- Advanced administrator tools
- Reporting and analytics
- Communication features

### Version 2.0 Planned Features

#### 1. AI-Enhanced Welcome Messages
- Dynamic, personalized welcome messages for each user type
- AI-generated variations to keep content fresh and engaging
- Contextual scripture references based on user role

#### 2. AI Scripture Integration
- For Sponsors: AI-selected scriptures focused on sacrificial giving and generosity
- For Missionaries: AI-curated verses of encouragement and ministry support
- Regular rotation of relevant biblical passages

#### 3. Enhanced Missionary Profile
- **Bridge of Hope Center Details**
  - Center name and address
  - Contact information (phone, email)
  - Operating hours
  - Facility details
- **Staff Information**
  - Missionary contact details
  - Role and responsibilities
  - Emergency contacts
- **Children Management**
  - List of children under care
  - Individual child profiles
    - Name
    - Child ID
    - Date of birth
    - Age calculation
    - Educational status
    - Special needs or requirements

#### 4. Enhanced Sponsor Dashboard
- **Sponsored Child Profile**
  - Child's full name
  - Date of birth
  - Current age
  - Recent photo
  - Educational progress
  - Health updates
- **Sponsorship Details**
  - Sponsor ID confirmation
  - Child ID confirmation
  - Sponsorship start date
  - Payment history
  - Impact reports

## 💻 Development

The project uses modern development practices:
- TypeScript for type safety
- ESLint for code quality
- Vite for fast development and building
- Tailwind CSS for utility-first styling

More documentation will be added as new features are developed.