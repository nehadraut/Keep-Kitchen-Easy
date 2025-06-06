import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { FAB, Card, Button, IconButton, Chip, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { auth, getItems, updateItem, deleteItem } from '../services/firebase';

const SubcategoryScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { category, subcategory } = route.params;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'User not authenticated');
      navigation.navigate('Login');
      return;
    }

    try {
      setLoading(true);
      const { items: fetchedItems, error } = await getItems(
        auth.currentUser.uid,
        category,
        subcategory
      );

      if (error) {
        Alert.alert('Error', error);
      } else {
        setItems(fetchedItems);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadItems();
  };

  const handleAddItem = () => {
    navigation.navigate('AddItem', { category, subcategory });
  };

  const handleScanBarcode = () => {
    navigation.navigate('Barcode', { category, subcategory });
  };

  const handleUpdateStatus = async (item, newStatus) => {
    try {
      const { success, error } = await updateItem(
        auth.currentUser.uid,
        item.id,
        { status: newStatus }
      );

      if (error) {
        Alert.alert('Error', error);
      } else {
        // Update local state
        const updatedItems = items.map(i => 
          i.id === item.id ? { ...i, status: newStatus } : i
        );
        setItems(updatedItems);
        Alert.alert('Success', t('common.successUpdateItem'));
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUpdateQuantity = async (item) => {
    // Simple implementation - in a real app, you might want a modal with input
    Alert.prompt(
      t('common.update') + ' ' + t('common.quantity'),
      t('common.quantity') + ' ' + t('common.for') + ' ' + item.name,
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.update'),
          onPress: async (quantity) => {
            if (quantity && !isNaN(quantity)) {
              try {
                const { success, error } = await updateItem(
                  auth.currentUser.uid,
                  item.id,
                  { quantity: parseInt(quantity, 10) }
                );

                if (error) {
                  Alert.alert('Error', error);
                } else {
                  // Update local state
                  const updatedItems = items.map(i => 
                    i.id === item.id ? { ...i, quantity: parseInt(quantity, 10) } : i
                  );
                  setItems(updatedItems);
                  Alert.alert('Success', t('common.successUpdateItem'));
                }
              } catch (error) {
                Alert.alert('Error', error.message);
              }
            } else {
              Alert.alert('Error', 'Please enter a valid number');
            }
          },
        },
      ],
      'plain-text',
      item.quantity.toString()
    );
  };

  const handleDeleteItem = async (item) => {
    Alert.alert(
      t('common.delete') + ' ' + item.name,
      t('common.delete') + ' ' + item.name + '?',
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          onPress: async () => {
            try {
              const { success, error } = await deleteItem(
                auth.currentUser.uid,
                item.id
              );

              if (error) {
                Alert.alert('Error', error);
              } else {
                // Update local state
                const updatedItems = items.filter(i => i.id !== item.id);
                setItems(updatedItems);
                Alert.alert('Success', t('common.successDeleteItem'));
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.itemCard}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Chip 
            mode="outlined" 
            style={[styles.statusChip, item.status === 'In Stock' ? styles.inStockChip : styles.outOfStockChip]}
          >
            {item.status === 'In Stock' ? t('common.inStock') : t('common.outOfStock')}
          </Chip>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemQuantity}>
            {t('common.quantity')}: {item.quantity}
          </Text>
          {item.expiryDate && (
            <Text style={styles.itemExpiry}>
              {t('common.expiryDate')}: {item.expiryDate}
            </Text>
          )}
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="outlined" 
          onPress={() => handleUpdateQuantity(item)}
          style={styles.actionButton}
        >
          {t('common.update')}
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={() => handleUpdateStatus(item, item.status === 'In Stock' ? 'Out of Stock' : 'In Stock')}
          style={styles.actionButton}
        >
          {item.status === 'In Stock' ? t('common.outOfStock') : t('common.inStock')}
        </Button>
        
        <IconButton 
          icon="delete" 
          size={20} 
          color="#F44336"
          onPress={() => handleDeleteItem(item)}
        />
      </Card.Actions>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('common.noItems')}</Text>
          <Button 
            mode="contained" 
            onPress={handleAddItem}
            style={styles.addButton}
          >
            {t('common.addItem')}
          </Button>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      
      <View style={styles.fabContainer}>
        <FAB
          style={[styles.fab, styles.scanFab]}
          icon="barcode-scan"
          label={t('common.scanBarcode')}
          onPress={handleScanBarcode}
          color="#fff"
        />
        <FAB
          style={[styles.fab, styles.addFab]}
          icon="plus"
          label={t('common.addItem')}
          onPress={handleAddItem}
          color="#fff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Extra padding for FAB
  },
  itemCard: {
    marginBottom: 15,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusChip: {
    height: 30,
  },
  inStockChip: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  outOfStockChip: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  divider: {
    marginVertical: 10,
  },
  itemDetails: {
    marginTop: 5,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  itemExpiry: {
    fontSize: 14,
    color: '#757575',
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  actionButton: {
    marginRight: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'column',
  },
  fab: {
    marginBottom: 16,
    borderRadius: 28,
  },
  addFab: {
    backgroundColor: '#4CAF50',
  },
  scanFab: {
    backgroundColor: '#2196F3',
  },
});

export default SubcategoryScreen;