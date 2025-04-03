# StudyBuddy

StudyBuddy is a React Native mobile application that helps students connect and collaborate in study groups. The app allows users to create, join, and participate in study groups, making it easier to find study partners and share knowledge.

## Features

- **User Authentication**: Secure signup and login functionality
- **Profile Management**: Customize your profile with display name, bio, and avatar
- **Study Groups**: Create and join study groups for different subjects
- **Real-time Chat**: Communicate with group members through the built-in chat feature
- **Group Management**: View your created and joined groups
- **Modern UI**: Clean and intuitive interface with a professional color scheme

## Tech Stack

- **Frontend**: React Native with Expo
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **UI Components**: React Native components with custom styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/veerlakshay/StudyBuddy
   cd StudyBuddy
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Set up Firebase:
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase configuration to `config/firebase.js`

4. Start the development server:
   ```
   npx expo start
   ```

5. Run on your device or emulator:
   - Scan the QR code with the Expo Go app
   - Press 'a' to run on Android emulator
   - Press 'i' to run on iOS simulator

## Project Structure

```
StudyBuddy/
├── assets/              # Images, fonts, and other static assets
├── components/          # Reusable UI components
├── config/              # Configuration files (Firebase, etc.)
├── navigation/          # Navigation configuration
├── screens/             # Application screens
│   ├── Auth/            # Authentication screens
│   ├── ChatScreen.js    # Group chat functionality
│   ├── GroupListScreen.js # List of available groups
│   ├── HomeScreen.js    # Main dashboard
│   ├── PostGroupScreen.js # Create new study group
│   ├── ProfileScreen.js # User profile
│   └── UserProfileScreen.js # Edit user profile
├── theme/               # Theme configuration (colors, etc.)
├── utils/               # Utility functions
├── App.js               # Main application component
└── package.json         # Project dependencies
```

## Color Scheme

The application uses a professional color palette:

- **Primary**: Indigo (#4F46E5)
- **Secondary**: Blue (#3B82F6)
- **Accent**: Emerald (#10B981)
- **Background**: Light gray (#F9FAFB)
- **Text**: Dark gray (#1F2937)
- **Muted**: Medium gray (#6B7280)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the React Native development platform
- [Firebase](https://firebase.google.com/) for backend services
- [React Native](https://reactnative.dev/) for the mobile framework 