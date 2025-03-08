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

## 🔒 User Registration & Authentication Flow

### For Sponsors

1. **Registration**
   - Click "Register" on the login page
   - Select "Register as Sponsor"
   - Provide:
     - Email address
     - Password
     - Sponsor ID (from welcome letter)
     - Child ID (from welcome letter)
   - Submit registration
   - Wait for administrator approval

2. **After Approval**
   - Sign in with email and password
   - Access sponsor dashboard featuring:
     - Sponsored child's information
     - Messaging interface
     - Unread message notifications
     - Prayer focus section
     - Biblical encouragement

### For Missionaries

1. **Registration**
   - Click "Register" on the login page
   - Select "Register as Missionary"
   - Provide:
     - Email address
     - Password
     - Bridge of Hope Center Name (optional)
     - Bridge of Hope Center ID (optional)
   - Submit registration
   - Wait for administrator approval

2. **After Approval**
   - Sign in with email and password
   - Access missionary dashboard featuring:
     - Bridge of Hope Center details
     - List of children at the center
     - Message management interface
     - Child status monitoring
     - Sponsorship tracking

### For Administrators

1. **Registration**
   - Click "Register" on the login page
   - Select "Request Administrator Access"
   - Provide email and password
   - Submit registration
   - Wait for existing administrator approval

2. **After Approval**
   - Sign in with email and password
   - Access admin dashboard featuring:
     - User management
     - Approval workflows
     - System statistics
     - Bridge of Hope center management

## 🛠️ Technical Architecture

### Frontend Stack

- **Framework**: React 18.3.1 with TypeScript
- **Routing**: React Router 6.22.2
- **Styling**: Tailwind CSS 3.4.1
- **State Management**: React Context API
- **Icons**: Lucide React 0.344.0
- **Notifications**: React Hot Toast 2.4.1

### Backend & Database

- **Backend Service**: Supabase
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth
- **API Client**: @supabase/supabase-js 2.39.7

### Development Tools

- **Build Tool**: Vite 5.4.2
- **TypeScript**: 5.5.3
- **Linting**: ESLint 9.9.1
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx      # Route protection component
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── lib/
│   └── supabase.ts            # Supabase client configuration
├── pages/
│   ├── Login.tsx              # Login page
│   ├── Register.tsx           # Registration page
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Messages.tsx           # Messaging interface
│   ├── MissionaryDashboard.tsx # Missionary-specific dashboard
│   ├── Administrators.tsx     # Admin management
│   ├── Missionaries.tsx       # Missionary management
│   ├── Sponsors.tsx          # Sponsor management
│   └── Pending.tsx           # Pending approvals
├── services/
│   ├── messageService.ts      # Message handling
│   ├── childService.ts        # Child data management
│   └── bridgeOfHopeCenterService.ts # Center management
└── types/
    ├── message.ts             # Message type definitions
    ├── child.ts              # Child type definitions
    └── bridgeOfHopeCenter.ts # Center type definitions
```

## 🔐 Security Features

### Authentication
- Email/password authentication
- Session management
- Token refresh mechanism
- Protected routes

### Authorization
- Role-based access control (RBAC)
- Row Level Security (RLS) policies
- User approval workflow
- Route protection

### Data Validation
- Sponsor ID validation (8 digits)
- Child ID validation (10 digits)
- Bridge of Hope Center ID validation (8 digits)
- Message length restrictions
- Input sanitization

## 💻 Screen Flow

### Public Screens
- `/login` - Login page
- `/register` - Registration page

### Protected Screens
- `/` - Role-specific dashboard
- `/messages` - Messaging interface
- `/messages/:sponsorId` - Specific sponsor messages
- `/missionary-dashboard` - Missionary center view

### Admin-Only Screens
- `/administrators` - Manage administrators
- `/missionaries` - Manage missionaries
- `/sponsors` - Manage sponsors
- `/authenticated-users` - View all users
- `/pending` - Handle pending approvals

## 🔄 Data Flow

### Message System
1. Sponsor writes message
2. Message stored in database
3. Missionary receives notification
4. Missionary can view and respond
5. Messages marked as read/unread

### Approval Workflow
1. User registers
2. Entry added to pending queue
3. Administrator reviews request
4. User notified of approval/rejection
5. Access granted upon approval

### Child-Sponsor Connection
1. Sponsor provides IDs during registration
2. System validates IDs
3. Connection established upon approval
4. Messaging enabled
5. Missionary oversees communication

## 📱 Features by Role

### Sponsor Features
- View sponsored child details
- Send/receive messages
- Track message history
- Receive spiritual encouragement
- Monitor communication status

### Missionary Features
- View center children
- Monitor sponsorships
- Facilitate communication
- Track child status
- Manage messages

### Administrator Features
- User management
- Approval workflows
- System monitoring
- Center management
- Access control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account

### Installation
```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add Supabase credentials to .env

# Start development server
npm run dev
```

### Environment Variables
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Supabase team for the excellent backend service
- React team for the robust frontend framework
- Open source community for various tools and libraries

## 📋 Upcoming Features & Improvements

### Child Biography System
- [ ] Add detailed child profile pages
  - Photo gallery
  - Background information
  - Academic progress
  - Interests and aspirations
  - Prayer requests
- [ ] Real-time profile updates by missionaries
- [ ] Secure access for sponsors and missionaries
- [ ] Age-appropriate information display

### Enhanced Message Security
- [ ] Message approval system for sponsor communications
  - [ ] Manual admin approval workflow
  - [ ] AI-powered content screening
    - Automatic detection of personal information
    - Social media handle detection
    - Contact information screening
    - Hyperlink validation
    - Address and phone number detection
- [ ] Direct message approval for child/missionary communications
- [ ] Notification system for pending approvals

### Image Messaging System
- [ ] Support for image attachments in messages
  - One image per message policy
  - Image size and format restrictions
  - Automatic image screening
- [ ] Admin approval workflow for sponsor-sent images
- [ ] Image gallery for approved photos
- [ ] Secure image storage and delivery

### Database Improvements
- [ ] Migration to production Supabase instance
- [ ] Enhanced data models for new features
- [ ] Optimization of database queries
- [ ] Improved row-level security policies
- [ ] Backup and recovery procedures

### Mobile Application
- [ ] React Native mobile app development
  - iOS support
  - Android support
- [ ] Native device features integration
  - Push notifications
  - Camera integration
  - Offline support
- [ ] Mobile-specific UI/UX optimizations
- [ ] App store deployment preparation

### General Improvements
- [ ] Performance optimization
- [ ] Accessibility enhancements
- [ ] Internationalization support
- [ ] Enhanced error handling
- [ ] Comprehensive testing suite
- [ ] Documentation updates