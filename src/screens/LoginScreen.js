import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { TextInput, Button, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../services/firebase';

const LoginScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHindi, setIsHindi] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleLanguage = () => {
    const newLang = isHindi ? 'en' : 'hi';
    i18n.changeLanguage(newLang);
    setIsHindi(!isHindi);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    
    try {
      // For Firebase, we need to use email format
      const email = username.includes('@') ? username : `${username}@example.com`;
      const { user, error } = await loginUser(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error);
      } else {
        // Navigate to Home screen and pass the username
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { username } }],
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.languageToggleContainer}>
          <Text>English</Text>
          <Switch
            value={isHindi}
            onValueChange={toggleLanguage}
            color="#4CAF50"
          />
          <Text>हिंदी</Text>
        </View>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/placeholder.txt')} 
            style={styles.logo}
          />
          <Text style={styles.title}>Kitchen Grocery System</Text>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            label={t('common.username')}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            mode="outlined"
            outlineColor="#4CAF50"
            activeOutlineColor="#4CAF50"
            left={<TextInput.Icon icon="account" />}
          />
          
          <TextInput
            label={t('common.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            style={styles.input}
            mode="outlined"
            outlineColor="#4CAF50"
            activeOutlineColor="#4CAF50"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={secureTextEntry ? "eye" : "eye-off"} 
                onPress={() => setSecureTextEntry(!secureTextEntry)} 
              />
            }
          />
          
          <Button 
            mode="contained" 
            onPress={handleLogin} 
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {t('common.login')}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  languageToggleContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;