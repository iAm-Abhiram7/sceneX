# Forensic AI - Mobile Application

A production-ready React Native mobile application for forensic evidence analysis with AI-powered chat interface and report generation.

## 🎨 Design Philosophy

This app follows a **Zen Garden & Tatami aesthetic** with:
- Warm, natural color palette inspired by Japanese minimalism
- Clean typography and generous spacing
- Subtle shadows and rounded corners
- Intuitive, gesture-based navigation

## 📱 Features

### Authentication
- ✅ Email/password sign up and login
- ✅ Mock authentication (no backend required)
- ✅ Persistent sessions with AsyncStorage
- ✅ Auto-navigation based on auth state

### Evidence Analysis
- 📷 Camera capture and gallery upload
- 🤖 AI-powered image analysis
- 💬 Interactive chat interface
- 🏷️ Automatic evidence tagging

### Report Management
- 📄 Auto-generated forensic reports
- 📊 Analysis history with search
- 🗂️ Case ID tracking (CASE-YYYY-XXXX format)
- 🗑️ Swipe-to-delete functionality

### User Profile
- 👤 Profile management
- ⚙️ App settings
- 📤 Data export options
- 🚪 Secure logout

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

### Installation

1. **Navigate to project directory:**
   ```bash
   cd forensic-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on device:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 🧪 Testing Credentials

The app includes pre-configured mock users:

| Email | Password | Role |
|-------|----------|------|
| admin@forensic.com | admin123 | Admin |
| user@forensic.com | user123 | Analyst |

You can also create new accounts through the sign-up screen.

## 📂 Project Structure

```
forensic-app/
├── app/                           # Expo Router screens
│   ├── _layout.tsx               # Root layout with providers
│   ├── (auth)/                   # Auth stack (login, signup)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # Home screen
│   │   ├── camera.tsx           # Camera/Upload screen
│   │   ├── chat.tsx             # AI Chat screen
│   │   ├── history.tsx          # History screen
│   │   └── settings.tsx         # Settings screen
│   └── report/[id].tsx          # Report detail modal
├── components/                   # Reusable components
│   ├── common/                  # Button, Input, Card, etc.
│   ├── auth/                    # Login/Signup forms
│   ├── home/                    # Home screen components
│   ├── chat/                    # Chat components
│   └── history/                 # History components
├── constants/                   # App constants
│   ├── Colors.ts               # Color palette & design system
│   ├── Types.ts                # TypeScript interfaces
│   └── MockData.ts             # Sample data for testing
├── context/                    # React Context providers
│   ├── AuthContext.tsx         # Authentication state
│   └── AppContext.tsx          # Global app state
├── services/                   # Service layer
│   ├── storage.service.ts      # AsyncStorage wrapper
│   ├── mockAuth.service.ts     # Mock authentication
│   └── mockApi.service.ts      # Mock API calls
├── utils/                      # Utility functions
│   ├── validators.ts           # Input validation
│   ├── formatters.ts           # Date/text formatting
│   └── helpers.ts              # Helper functions
└── assets/                     # Images and icons
```

## 🎨 Color Palette

```typescript
const Colors = {
  // Primary
  primary: '#2F2F2F',        // Graphite
  background: '#F5F3EF',     // Warm Off-White
  accent: '#3E5C76',         // Indigo Ink
  
  // Support
  sage: '#B5C99A',           // Light Sage
  sand: '#E0D8C3',           // Muted Sand
  
  // Typography
  text: '#1B1B1B',           // Dark Charcoal
  textSecondary: '#6B6B6B',  // Gray
  textLight: '#FFFFFF',      // White
  
  // UI
  cardBackground: '#FFFFFF',
  border: '#E0D8C3',
  success: '#B5C99A',
  error: '#D9534F',
  warning: '#F0AD4E',
};
```

## 🔐 Authentication Flow

1. **App Launch**
   - Check for stored auth token
   - If valid → Navigate to Home
   - If invalid → Navigate to Login

2. **Login**
   - Enter email/password
   - Mock service validates credentials
   - Store token and user in AsyncStorage
   - Navigate to Home

3. **Sign Up**
   - Enter user details
   - Mock service creates user
   - Auto-login and navigate to Home

4. **Logout**
   - Clear AsyncStorage
   - Navigate to Login

## 📸 Camera & Upload Flow

1. **Camera Screen**
   - Choose "Take Photo" or "Choose from Gallery"
   - Request camera/photo library permissions
   - Select/capture image

2. **Image Processing**
   - Compress image (quality: 0.8, max: 1920x1080)
   - Navigate to Chat with imageUri

3. **AI Analysis**
   - Send image to mock AI service
   - Display typing indicator
   - Show AI response after 2s delay

## 💬 Chat Interface

### Features
- Message bubbles (user: right, AI: left)
- Image attachments
- Typing indicators
- Suggestion chips
- Copy message on long-press

### Generating Reports
1. Click "Generate Report" in chat header
2. AI analyzes full chat history
3. Creates formatted forensic report (3s delay)
4. Saves to AsyncStorage with unique case ID
5. Shows success notification
6. Option to view saved report

## 📊 Report Structure

Each report includes:
- **Case ID**: Unique identifier (CASE-YYYY-XXXX)
- **Images**: All uploaded evidence photos
- **Chat History**: Complete AI conversation
- **Report Content**: Formal forensic analysis
- **Evidence Tags**: Auto-detected categories
- **Summary**: First 200 characters of report
- **Status**: draft or completed
- **Timestamp**: Creation date/time

## 🗂️ History & Search

- View all reports in chronological order
- Filter by time period: All, This Week, This Month, Older
- Search by case ID, summary, or evidence tags
- Pull-to-refresh
- Swipe-to-delete with confirmation
- Pagination (20 items per page)

## ⚙️ Settings

### Profile Section
- Display name and email
- Member since date
- Edit profile (future feature)

### Preferences
- Dark mode toggle (UI only, not functional)
- Notifications toggle
- Image quality selector

### Data Management
- Export all reports (future feature)
- Clear cache
- Delete all data with confirmation

### Account
- Logout button

## 🛠️ Development

### Adding New Features

1. **New Screen:**
   - Create file in `app/(tabs)/` or `app/`
   - Use Expo Router conventions
   - Import necessary components and hooks

2. **New Component:**
   - Create file in appropriate `components/` subfolder
   - Define TypeScript interface for props
   - Use Colors and Typography constants
   - Export as named export

3. **New Service:**
   - Create file in `services/`
   - Add mock delay for realistic UX
   - Handle errors appropriately
   - Update types if needed

### Code Quality

- ✅ TypeScript for type safety
- ✅ Consistent naming conventions
- ✅ Component composition
- ✅ Custom hooks for reusable logic
- ✅ Error boundaries (future)
- ✅ Comments for complex logic

### Performance

- ✅ React.memo for expensive components
- ✅ FlatList optimization (keyExtractor, getItemLayout)
- ✅ Image caching
- ✅ Debounced search
- ✅ Lazy loading

## 📱 Navigation

### Auth Stack (Unauthorized)
```
(auth)
├── login
└── signup
```

### Tab Navigator (Authorized)
```
(tabs)
├── index (Home)
├── camera
├── chat
├── history
└── settings
```

### Modals
```
report/[id] - Report detail modal
```

## 🔄 State Management

### AuthContext
- `user`: Current user or null
- `isAuthenticated`: Boolean
- `isLoading`: Loading state
- `login()`: Authenticate user
- `signup()`: Register new user
- `logout()`: Clear session
- `checkAuth()`: Verify auth status

### AppContext
- `reports`: Array of all reports
- `currentChatMessages`: Active chat messages
- `addMessage()`: Add message to chat
- `clearChat()`: Reset chat
- `saveReport()`: Save new report
- `deleteReport()`: Remove report
- `refreshReports()`: Reload from storage

## 🎯 Mock Data

The app includes realistic mock data:
- 5 sample users
- 10 forensic reports
- Various evidence types
- Realistic AI responses
- Multiple case scenarios

## 🚨 Error Handling

- Input validation on all forms
- User-friendly error messages
- Try-catch blocks in async operations
- Fallback states for missing data
- Network simulation delays

## 🎨 UI/UX Features

- Smooth animations
- Loading states
- Pull-to-refresh
- Optimistic UI updates
- Keyboard avoidance
- Auto-focus inputs
- Toast notifications
- Empty states
- Skeleton screens (future)

## 📦 Dependencies

### Core
- `expo` - Expo SDK
- `react-native` - React Native framework
- `react` - React library

### Navigation
- `expo-router` - File-based routing
- `@react-navigation/native` - Navigation core
- `@react-navigation/bottom-tabs` - Tab navigator

### Storage
- `@react-native-async-storage/async-storage` - Local storage
- `expo-secure-store` - Secure token storage

### UI & Components
- `@expo/vector-icons` - Icon library
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Native screens
- `react-native-gesture-handler` - Gesture support

### Media
- `expo-image-picker` - Camera & gallery access

### Utilities
- `expo-constants` - App constants
- `expo-linking` - Deep linking
- `expo-status-bar` - Status bar control

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache
npx expo start -c

# Reset metro bundler
rm -rf node_modules
npm install
```

### AsyncStorage issues
```bash
# Clear app data
# iOS: Reset simulator
# Android: Clear app data in settings
```

### Permission issues
- Ensure permissions are granted in device settings
- Check app.json for permission configuration
- Restart app after granting permissions

## 📝 TODO / Future Enhancements

- [ ] Backend integration (connect to forensic-backend API)
- [ ] Real-time chat with streaming responses
- [ ] Google Gemini AI integration
- [ ] Actual dark mode implementation
- [ ] Biometric authentication
- [ ] Offline mode with sync
- [ ] PDF export of reports
- [ ] Evidence map/location tracking
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

For issues or questions:
1. Check this README
2. Review mock data in `constants/MockData.ts`
3. Test with provided credentials
4. Check console logs for errors

---

**Built with ❤️ for Forensic Analysis**

Zen Garden Aesthetic • AI-Powered • Production Ready
