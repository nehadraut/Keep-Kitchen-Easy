import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  FlatList,
  StatusBar 
} from 'react-native';
import { useTranslation } from 'react-i18next';

const CategoryScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { category } = route.params;
  
  // Define subcategories based on the selected category
  const subcategories = category === t('common.veg') 
    ? [
        { id: '1', name: t('common.vegetables'), icon: 'vegetable' },
        { id: '2', name: t('common.fruits'), icon: 'fruit' },
        { id: '3', name: t('common.spices'), icon: 'spice' },
      ]
    : [
        { id: '1', name: t('common.chicken'), icon: 'chicken' },
        { id: '2', name: t('common.fish'), icon: 'fish' },
        { id: '3', name: t('common.eggs'), icon: 'egg' },
      ];

  const navigateToSubcategory = (subcategory) => {
    navigation.navigate('Subcategory', { 
      category, 
      subcategory: subcategory.name 
    });
  };

  const renderSubcategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.subcategoryItem}
      onPress={() => navigateToSubcategory(item)}
    >
      <View style={styles.subcategoryContent}>
        <Image 
          source={require('../../assets/placeholder.txt')} 
          style={styles.subcategoryIcon}
        />
        <Text style={styles.subcategoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {category === t('common.veg') 
            ? t('common.veg') 
            : t('common.nonVeg')} {t('common.categories')}
        </Text>
      </View>
      
      <FlatList
        data={subcategories}
        renderItem={renderSubcategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
  },
  subcategoryItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    overflow: 'hidden',
  },
  subcategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  subcategoryIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  subcategoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CategoryScreen;