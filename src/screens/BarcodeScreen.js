import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useTranslation } from 'react-i18next';
import { getItemByBarcode } from '../services/firebase';

const BarcodeScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { category, subcategory } = route.params;
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || !scanning) return;
    
    setScanned(true);
    setScanning(false);
    setLoading(true);
    
    try {
      // Get item data from barcode
      const { item, error } = await getItemByBarcode(data);
      
      if (error) {
        Alert.alert('Error', error, [
          {
            text: 'Try Again',
            onPress: () => {
              setScanned(false);
              setScanning(true);
              setLoading(false);
            },
          },
          {
            text: 'Add Manually',
            onPress: () => {
              navigation.navigate('AddItem', { 
                category, 
                subcategory,
                barcodeData: { barcode: data }
              });
            },
          },
        ]);
      } else if (item) {
        // If item found, navigate to add item screen with pre-filled data
        Alert.alert(
          'Item Found',
          `Found: ${item.name}\nCategory: ${item.category}\nSubcategory: ${item.subcategory}`,
          [
            {
              text: 'Add to Inventory',
              onPress: () => {
                navigation.navigate('AddItem', { 
                  category: item.category || category, 
                  subcategory: item.subcategory || subcategory,
                  barcodeData: { 
                    ...item,
                    barcode: data 
                  }
                });
              },
            },
            {
              text: 'Scan Again',
              onPress: () => {
                setScanned(false);
                setScanning(true);
                setLoading(false);
              },
            },
          ]
        );
      } else {
        // If no item found but no error
        Alert.alert('No Item Found', 'No product information found for this barcode.', [
          {
            text: 'Try Again',
            onPress: () => {
              setScanned(false);
              setScanning(true);
              setLoading(false);
            },
          },
          {
            text: 'Add Manually',
            onPress: () => {
              navigation.navigate('AddItem', { 
                category, 
                subcategory,
                barcodeData: { barcode: data }
              });
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.message, [
        {
          text: 'Try Again',
          onPress: () => {
            setScanned(false);
            setScanning(true);
            setLoading(false);
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          {t('common.goBack')}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scanning ? (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.scanner}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          flashMode={
            torchOn 
              ? BarCodeScanner.Constants.FlashMode.torch 
              : BarCodeScanner.Constants.FlashMode.off
          }
        />
      ) : (
        <View style={styles.loadingContainer}>
          {loading ? (
            <>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.text}>Looking up barcode information...</Text>
            </>
          ) : (
            <Text style={styles.text}>Tap "Scan Again" to scan another barcode</Text>
          )}
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.scannerFrame} />
        
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            {t('common.scanBarcode')}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <IconButton
            icon={torchOn ? "flashlight-off" : "flashlight"}
            size={30}
            color="#fff"
            style={styles.torchButton}
            onPress={toggleTorch}
          />
          
          {scanned && (
            <Button 
              mode="contained" 
              onPress={() => {
                setScanned(false);
                setScanning(true);
              }}
              style={styles.scanAgainButton}
              labelStyle={styles.buttonLabel}
            >
              {t('common.scanAgain')}
            </Button>
          )}
          
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            labelStyle={styles.buttonLabel}
          >
            {t('common.cancel')}
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  instructions: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    margin: 10,
  },
  scanAgainButton: {
    backgroundColor: '#4CAF50',
    margin: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    margin: 10,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    padding: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
  },
});

export default BarcodeScreen;