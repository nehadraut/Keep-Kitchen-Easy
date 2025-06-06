import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Alert,
  StatusBar 
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { auth, logoutUser } from '../services/firebase';

const HomeScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const [isHindi, setIsHindi] = useState(i18n.language === 'hi');
  const { username } = route.params || { username: auth.currentUser?.displayName || 'User' };

  useEffect(() => {
    // Set up navigation options with logout button
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <IconButton
            icon={isHindi ? "translate" : "translate"}
            size={24}
            color="#fff"
            onPress={toggleLanguage}
          />
          <IconButton
            icon="logout"
            size={24}
            color="#fff"
            onPress={handleLogout}
          />
        </View>
      ),
    });
  }, [navigation, isHindi]);

  const toggleLanguage = () => {
    const newLang = isHindi ? 'en' : 'hi';
    i18n.changeLanguage(newLang);
    setIsHindi(!isHindi);
  };

  const handleLogout = async () => {
    try {
      const { error } = await logoutUser();
      if (error) {
        Alert.alert('Error', error);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const navigateToCategory = (category) => {
    navigation.navigate('Category', { category });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          {t('common.welcome', { username })}
        </Text>
      </View>
      
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>{t('common.categories')}</Text>
        
        <View style={styles.categoryButtonsContainer}>
          <TouchableOpacity 
            style={[styles.categoryButton, styles.vegButton]}
            onPress={() => navigateToCategory(t('common.veg'))}
          >
            <Image 
              source={require('../../assets/placeholder.txt')} 
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryButtonText}>{t('common.veg')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryButton, styles.nonVegButton]}
            onPress={() => navigateToCategory(t('common.nonVeg'))}
          >
            <Image 
              source={require('../../assets/placeholder.txt')} 
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryButtonText}>{t('common.nonVeg')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  welcomeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  categoriesContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    elevation: 3,
  },
  vegButton: {
    backgroundColor: '#4CAF50',
  },
  nonVegButton: {
    backgroundColor: '#FF5722',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;