# Kitchen Grocery System

A mobile-friendly grocery inventory management system designed for easy use by non-technical users. This application helps you keep track of your kitchen inventory with a clean, touch-friendly interface.

## Features

- **User Authentication**: Secure login system
- **Categorized Inventory**: Organized into Veg and Non-Veg categories
- **Subcategories**: Further organization into specific food types
- **Item Management**: Add, update, and delete grocery items
- **Barcode Scanning**: Quickly add items using your device's camera
- **Multilingual Support**: Toggle between English and Hindi
- **Voice Input**: Add items using voice commands (optional feature)
- **Cloud Storage**: All data is securely stored and accessible across devices

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd kitchen-grocery-system
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Configure Firebase
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration (apiKey, authDomain, etc.)
   - Update the Firebase configuration in `src/services/firebase.js` and `App.js`

4. Start the development server
   ```
   npm start
   # or
   yarn start
   ```

5. Run on a device or emulator
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Or press 'a' to run on an Android emulator or 'i' to run on an iOS simulator

## Usage

1. **Login**: Enter your username and password on the login screen
2. **Navigate Categories**: Choose between Veg and Non-Veg categories
3. **Select Subcategory**: Pick a specific subcategory (e.g., Vegetables, Chicken)
4. **Manage Items**: View, add, update, or delete items in each subcategory
5. **Add Items**: Either manually enter item details or scan a barcode
6. **Update Status**: Mark items as "In Stock" or "Out of Stock"

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **Firebase**: Authentication and database
- **React Navigation**: Navigation library
- **React Native Paper**: UI component library
- **i18next**: Internationalization framework
- **Expo Barcode Scanner**: Barcode scanning functionality

## Customization

- **Language**: Toggle between English and Hindi using the language switch
- **Add More Categories**: Extend the app by adding more categories in the CategoryScreen component
- **Custom Themes**: Modify the color scheme in the style objects of each component

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by React Native Paper and Expo Vector Icons
- Barcode scanning powered by Expo Barcode Scanner
- Multilingual support implemented with i18next

---

Developed with ❤️ for making kitchen inventory management easier.