import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    welcome: 'Welcome to your kitchen, {{username}}',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    categories: 'Categories',
    veg: 'Veg',
    nonVeg: 'Non-Veg',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    spices: 'Spices',
    chicken: 'Chicken',
    fish: 'Fish',
    eggs: 'Eggs',
    addItem: 'Add Item',
    scanBarcode: 'Scan Barcode',
    itemName: 'Item Name',
    quantity: 'Quantity',
    expiryDate: 'Expiry Date (Optional)',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    update: 'Update',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    voiceInput: 'Voice Input',
    switchToHindi: 'हिंदी में बदलें',
    switchToEnglish: 'Switch to English',
    noItems: 'No items found. Add some items to get started!',
    errorLogin: 'Login failed. Please check your credentials.',
    successLogin: 'Login successful!',
    errorAddItem: 'Failed to add item. Please try again.',
    successAddItem: 'Item added successfully!',
    errorUpdateItem: 'Failed to update item. Please try again.',
    successUpdateItem: 'Item updated successfully!',
    errorDeleteItem: 'Failed to delete item. Please try again.',
    successDeleteItem: 'Item deleted successfully!',
    optional: 'Optional',
    required: 'Required'
  }
};

// Hindi translations
const hiTranslations = {
  common: {
    welcome: 'आपके रसोई में आपका स्वागत है, {{username}}',
    login: 'लॉगिन',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    categories: 'श्रेणियाँ',
    veg: 'शाकाहारी',
    nonVeg: 'मांसाहारी',
    vegetables: 'सब्जियां',
    fruits: 'फल',
    spices: 'मसाले',
    chicken: 'चिकन',
    fish: 'मछली',
    eggs: 'अंडे',
    addItem: 'आइटम जोड़ें',
    scanBarcode: 'बारकोड स्कैन करें',
    itemName: 'आइटम का नाम',
    quantity: 'मात्रा',
    expiryDate: 'समाप्ति तिथि (वैकल्पिक)',
    inStock: 'स्टॉक में',
    outOfStock: 'स्टॉक में नहीं',
    update: 'अपडेट',
    delete: 'हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    voiceInput: 'आवाज इनपुट',
    switchToHindi: 'हिंदी में बदलें',
    switchToEnglish: 'अंग्रेजी में बदलें',
    noItems: 'कोई आइटम नहीं मिला। शुरू करने के लिए कुछ आइटम जोड़ें!',
    errorLogin: 'लॉगिन विफल। कृपया अपने क्रेडेंशियल्स की जांच करें।',
    successLogin: 'लॉगिन सफल!',
    errorAddItem: 'आइटम जोड़ने में विफल। कृपया पुनः प्रयास करें।',
    successAddItem: 'आइटम सफलतापूर्वक जोड़ा गया!',
    errorUpdateItem: 'आइटम अपडेट करने में विफल। कृपया पुनः प्रयास करें।',
    successUpdateItem: 'आइटम सफलतापूर्वक अपडेट किया गया!',
    errorDeleteItem: 'आइटम हटाने में विफल। कृपया पुनः प्रयास करें।',
    successDeleteItem: 'आइटम सफलतापूर्वक हटा दिया गया!',
    optional: 'वैकल्पिक',
    required: 'आवश्यक'
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslations,
      hi: hiTranslations
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;