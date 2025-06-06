import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { TextInput, Button, Switch, RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Speech from 'expo-speech';
import { auth, addItem } from '../services/firebase';

const AddItemScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { category, subcategory, barcodeData } = route.params || {};
  
  const [name, setName] = useState(barcodeData?.name || '');
  const [quantity, setQuantity] = useState(barcodeData?.quantity?.toString() || '1');
  const [status, setStatus] = useState('In Stock');
  const [expiryDate, setExpiryDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningFor, setListeningFor] = useState(null); // 'name' or 'quantity'

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter item name');
      return;
    }

    if (!quantity.trim() || isNaN(quantity)) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);

    try {
      const itemData = {
        name: name.trim(),
        quantity: parseInt(quantity, 10),
        status,
        expiryDate: expiryDate || null,
        createdAt: new Date(),
      };

      const { id, error } = await addItem(
        auth.currentUser.uid,
        category,
        subcategory,
        itemData
      );

      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Success', t('common.successAddItem'), [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Subcategory', { category, subcategory }) 
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    setExpiryDate(formattedDate);
  };

  const startVoiceRecognition = (field) => {
    setListeningFor(field);
    setIsListening(true);
    
    // In a real app, you would use a voice recognition library here
    // For this demo, we'll simulate voice input with a timeout
    setTimeout(() => {
      let recognizedText = '';
      
      if (field === 'name') {
        // Simulate recognized text for name
        recognizedText = 'Tomatoes';
        setName(recognizedText);
      } else if (field === 'quantity') {
        // Simulate recognized text for quantity
        recognizedText = '5';
        setQuantity(recognizedText);
      }
      
      setIsListening(false);
      setListeningFor(null);
      
      // Provide feedback
      Alert.alert('Voice Input', `Recognized: ${recognizedText}`);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.inputRow}>
            <TextInput
              label={t('common.itemName')}
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              outlineColor="#4CAF50"
              activeOutlineColor="#4CAF50"
              left={<TextInput.Icon icon="food" />}
              right={
                <TextInput.Icon 
                  icon={isListening && listeningFor === 'name' ? "microphone-outline" : "microphone"} 
                  color={isListening && listeningFor === 'name' ? "#F44336" : "#4CAF50"}
                  onPress={() => startVoiceRecognition('name')} 
                />
              }
            />
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              label={t('common.quantity')}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              outlineColor="#4CAF50"
              activeOutlineColor="#4CAF50"
              left={<TextInput.Icon icon="numeric" />}
              right={
                <TextInput.Icon 
                  icon={isListening && listeningFor === 'quantity' ? "microphone-outline" : "microphone"} 
                  color={isListening && listeningFor === 'quantity' ? "#F44336" : "#4CAF50"}
                  onPress={() => startVoiceRecognition('quantity')} 
                />
              }
            />
          </View>
          
          <View style={styles.datePickerContainer}>
            <Text style={styles.label}>{t('common.expiryDate')}</Text>
            <View style={styles.dateRow}>
              <TextInput
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="YYYY-MM-DD"
                style={styles.dateInput}
                mode="outlined"
                outlineColor="#4CAF50"
                activeOutlineColor="#4CAF50"
                left={<TextInput.Icon icon="calendar" />}
                editable={false}
              />
              <Button 
                mode="contained" 
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                {t('common.select')}
              </Button>
            </View>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={styles.label}>{t('common.status')}</Text>
            <RadioButton.Group onValueChange={value => setStatus(value)} value={status}>
              <View style={styles.radioRow}>
                <RadioButton.Item 
                  label={t('common.inStock')} 
                  value="In Stock" 
                  color="#4CAF50"
                  style={styles.radioButton}
                />
                <RadioButton.Item 
                  label={t('common.outOfStock')} 
                  value="Out of Stock" 
                  color="#F44336"
                  style={styles.radioButton}
                />
              </View>
            </RadioButton.Group>
          </View>
          
          <Button 
            mode="contained" 
            onPress={handleSave} 
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {t('common.save')}
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()} 
            style={styles.cancelButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.cancelButtonLabel}
          >
            {t('common.cancel')}
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
    padding: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputRow: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dateButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
  },
  statusContainer: {
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    flex: 1,
  },
  saveButton: {
    marginBottom: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
  },
  cancelButton: {
    borderColor: '#F44336',
    paddingVertical: 8,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
});

export default AddItemScreen;