# Authentication System for Alzico

This document describes the new authentication system that has been added to the Alzico app.

## Features Added

### 1. Welcome Screen
- Updated to show two options: **Login** and **Sign Up**
- Clean, modern UI with separate buttons for each action

### 2. Login Screen
- Email and password fields
- Form validation (required fields, email format)
- Demo credentials: `demo@alzico.com` / `password123`
- Loading states during authentication
- Navigation to signup page
- Enter key support for quick login

### 3. Signup Screen
- Full name, email, password, and confirm password fields
- Comprehensive validation:
  - All fields required
  - Email format validation
  - Password confirmation matching
  - Minimum password length (6 characters)
- Loading states during account creation
- Navigation back to login page

### 4. Authentication Context
- Centralized authentication state management
- User session handling
- Login/logout/signup functions
- User data storage

## How to Use

### For Users:
1. **New Users**: Click "Sign Up" on the welcome screen
   - Fill in your full name, email, and password
   - Confirm your password
   - Click "Sign Up" to create your account

2. **Existing Users**: Click "Login" on the welcome screen
   - Enter your email and password
   - Click "Login" or press Enter
   - Use demo credentials: `demo@alzico.com` / `password123`

### For Developers:
- The authentication system is built using React Context
- All authentication logic is centralized in `AuthContext.tsx`
- Easy to extend with real API calls
- Proper error handling and loading states

## File Structure

```
alzico/
├── context/
│   └── AuthContext.tsx          # Authentication context
├── screens/
│   ├── WelcomeScreen.tsx        # Updated welcome screen
│   ├── LoginScreen.tsx          # Login functionality
│   └── SignupScreen.tsx         # Signup functionality
├── navigation/
│   └── AppNavigator.tsx         # Updated navigation
└── App.tsx                      # Wrapped with AuthProvider
```

## Technical Details

- **State Management**: React Context API for global authentication state
- **Navigation**: React Navigation with proper screen flow
- **Validation**: Client-side form validation with user feedback
- **Loading States**: Proper loading indicators during async operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on both mobile and web platforms

## Demo Credentials

For testing purposes, you can use:
- **Email**: `demo@alzico.com`
- **Password**: `password123`

## Future Enhancements

- Real API integration
- Password recovery
- Remember me functionality
- Biometric authentication
- Social login options
- User profile management

## Notes

- The current implementation uses simulated authentication
- All user data is stored in memory (not persistent)
- Form validation is client-side only
- The system is ready for backend integration 