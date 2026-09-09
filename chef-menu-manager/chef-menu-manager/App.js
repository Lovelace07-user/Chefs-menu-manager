import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';

export default function App() {
  const initialItems = [
    {
      id: '1',
      dishName: 'Grilled Salmon',
      description: 'Fresh salmon grilled to perfection with herbs and lemon.',
      course: 'Main Course',
      price: '185.00',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    },
    {
      id: '2',
      dishName: 'Tomato Soup',
      description: 'Creamy tomato soup with a touch of basil.',
      course: 'Starter',
      price: '65.00',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    },
    {
      id: '3',
      dishName: 'Chocolate Mousse',
      description: 'Light and airy chocolate mousse with whipped cream.',
      course: 'Dessert',
      price: '75.00',
      image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
    },
  ];

  const [menuItems, setMenuItems] = useState(initialItems);
  const [orderedItems, setOrderedItems] = useState([]);
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Main Course');
  const [price, setPrice] = useState('');
  const [screen, setScreen] = useState('list');
  const [orderNumber, setOrderNumber] = useState('');
  const [hasSavedSomething, setHasSavedSomething] = useState(false);

  const selectDish = (item) => {
    setDishName(item.dishName);
    setCourse(item.course);
    setPrice(item.price);
    setDescription('');
    setScreen('add');
  };

  const saveMenuItem = () => {
    const name = dishName.trim();
    const desc = description.trim();
    const priceText = price.trim();

    if (name === '') {
      Alert.alert('Missing Information', 'Please enter the dish name.');
      return;
    }
    if (desc === '') {
      Alert.alert('Missing Information', 'Please enter a description before saving.');
      return;
    }
    if (priceText === '') {
      Alert.alert('Missing Information', 'Please enter the price.');
      return;
    }

    const numberPrice = parseFloat(priceText);
    if (isNaN(numberPrice) || numberPrice <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than zero.');
      return;
    }

    // try to keep the original picture if it matches a sample dish
    let imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
    const matched = initialItems.find(
      (item) => item.dishName.toLowerCase() === name.toLowerCase()
    );
    if (matched) {
      imageUrl = matched.image;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName: name,
      description: desc,
      course: course,
      price: numberPrice.toFixed(2),
      image: imageUrl,
    };

    setMenuItems([...menuItems, newItem]);
    setOrderedItems([...orderedItems, newItem]);
    setHasSavedSomething(true);

    // clear form but stay on the Add page
    setDishName('');
    setDescription('');
    setCourse('Main Course');
    setPrice('');
  };

  const finishOrder = () => {
    const num = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    setOrderNumber(num);
    setScreen('confirmed');
  };

  const restartApp = () => {
    setMenuItems(initialItems);
    setOrderedItems([]);
    setHasSavedSomething(false);
    setDishName('');
    setDescription('');
    setCourse('Main Course');
    setPrice('');
    setScreen('list');
  };

  const getBadgeColour = (courseName) => {
    if (courseName === 'Starter') return { backgroundColor: '#FEF3C7' };
    if (courseName === 'Main Course') return { backgroundColor: '#DBEAFE' };
    if (courseName === 'Dessert') return { backgroundColor: '#F3E8FF' };
    return { backgroundColor: '#E5E7EB' };
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => selectDish(item)} activeOpacity={0.8}>
        <Image source={{ uri: item.image }} style={styles.foodImage} />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.dishName}>{item.dishName}</Text>
          <Text style={styles.price}>R{item.price}</Text>
        </View>

        <View style={[styles.badge, getBadgeColour(item.course)]}>
          <Text style={styles.badgeText}>{item.course}</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  // ========== ORDER CONFIRMED ==========
  if (screen === 'confirmed') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.confirmBox}>
          <Text style={styles.bigTick}>✓</Text>
          <Text style={styles.confirmTitle}>Order Confirmed</Text>
          <Text style={styles.confirmText}>Thank you! Your order has been received.</Text>
          <Text style={styles.orderNumber}>Order Number: {orderNumber}</Text>

          <Text style={styles.orderedTitle}>Your Ordered Dishes:</Text>

          {orderedItems.map((item) => (
            <View key={item.id} style={styles.orderedCard}>
              <Image source={{ uri: item.image }} style={styles.orderedImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.orderedName}>{item.dishName}</Text>
                <Text style={styles.orderedPrice}>R{item.price}</Text>
                <Text style={styles.orderedDesc}>{item.description}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.mainButton} onPress={restartApp}>
            <Text style={styles.mainButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ========== LIST SCREEN ==========
  if (screen === 'list') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Menu</Text>
        </View>

        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          contentContainerStyle={styles.listPadding}
        />

        {hasSavedSomething ? (
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={[styles.smallButton, { backgroundColor: '#228B22' }]}
              onPress={() => setScreen('add')}
            >
              <Text style={styles.smallButtonText}>Order More</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallButton, { backgroundColor: '#2563EB' }]}
              onPress={finishOrder}
            >
              <Text style={styles.smallButtonText}>Done Ordering</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.mainButton} onPress={() => setScreen('add')}>
            <Text style={styles.mainButtonText}>+ Add Menu Item</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  // ========== ADD SCREEN ==========
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Menu Item</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>Dish Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Grilled Salmon"
            value={dishName}
            onChangeText={setDishName}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.multiLine]}
            placeholder="Please type a description for this dish..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Course *</Text>
          <View style={styles.courseRow}>
            {['Starter', 'Main Course', 'Dessert'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.courseButton,
                  course === item && styles.courseButtonSelected,
                ]}
                onPress={() => setCourse(item)}
              >
                <Text
                  style={[
                    styles.courseButtonText,
                    course === item && styles.courseButtonTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Price (R) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity style={styles.mainButton} onPress={saveMenuItem}>
            <Text style={styles.mainButtonText}>Save Menu Item</Text>
          </TouchableOpacity>

          {/* Show saved dishes at the bottom */}
          {orderedItems.length > 0 && (
            <View style={styles.savedSection}>
              <Text style={styles.savedTitle}>Saved Dishes</Text>

              {orderedItems.map((item) => (
                <View key={item.id} style={styles.savedCard}>
                  <Image source={{ uri: item.image }} style={styles.savedImage} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.savedName}>{item.dishName}</Text>
                    <Text style={styles.savedPrice}>R{item.price}</Text>
                    <Text style={styles.savedDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: '#228B22', marginTop: 10 }]}
            onPress={() => setScreen('list')}
          >
            <Text style={styles.mainButtonText}>Back to Order More</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => setScreen('list')}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listPadding: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 25,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  smallButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  mainButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  mainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  multiLine: {
    height: 90,
    textAlignVertical: 'top',
  },
  courseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  courseButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  courseButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  courseButtonText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  courseButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 8,
    padding: 10,
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 15,
  },
  // saved dishes section
  savedSection: {
    marginTop: 25,
    marginBottom: 10,
  },
  savedTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  savedCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  savedImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  savedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  savedPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A5F',
    marginTop: 2,
  },
  savedDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  // confirmation screen
  confirmBox: {
    padding: 30,
    alignItems: 'center',
  },
  bigTick: {
    fontSize: 80,
    color: '#10B981',
    marginBottom: 10,
  },
  confirmTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 25,
  },
  orderedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  orderedCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  orderedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  orderedPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E3A5F',
    marginTop: 2,
  },
  orderedDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
