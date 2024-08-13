// screens/MentalHealthScreen.js
import React from 'react';
import { View, Text, FlatList, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use expo icons for better UI

const mentalHealthResources = [
  {
    category: "Meditation Guides",
    data: [
      { name: "Headspace", description: "Guided meditation and mindfulness.", website: "https://www.headspace.com" },
      { name: "Calm", description: "Sleep, meditation, and relaxation.", website: "https://www.calm.com" },
    ]
  },
  {
    category: "Virtual Therapy Options",
    data: [
      { name: "BetterHelp", description: "Online counseling and therapy.", website: "https://www.betterhelp.com" },
      { name: "Talkspace", description: "Text and video therapy sessions.", website: "https://www.talkspace.com" },
    ]
  },
  {
    category: "Hotlines",
    data: [
      { name: "National Suicide Prevention Lifeline", description: "24/7 support for people in distress.", phone: "1-800-273-8255" },
      { name: "Crisis Text Line", description: "Text HOME to 741741 for 24/7 support.", phone: "Text HOME to 741741" },
    ]
  },
  {
    category: "Self-Help Resources",
    data: [
      { name: "Mental Health America", description: "Mental health resources and screening tools.", website: "https://www.mhanational.org" },
      { name: "NAMI", description: "Support, education, and advocacy for mental health.", website: "https://www.nami.org" },
    ]
  },
];

export default function MentalHealthScreen() {
  return (
    <FlatList
      data={mentalHealthResources}
      keyExtractor={(item) => item.category}
      renderItem={({ item }) => (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{item.category}</Text>
          {item.data.map((resource, index) => (
            <View key={index} style={styles.resourceItem}>
              <View style={styles.resourceHeader}>
                <Ionicons name="heart-outline" size={24} color="#4CAF50" />
                <Text style={styles.resourceName}>{resource.name}</Text>
              </View>
              <Text style={styles.resourceDescription}>{resource.description}</Text>
              {resource.website && (
                <TouchableOpacity onPress={() => Linking.openURL(resource.website)}>
                  <Text style={styles.resourceLink}><Ionicons name="link-outline" size={16} color="#1e90ff" /> Visit Website</Text>
                </TouchableOpacity>
              )}
              {resource.phone && (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${resource.phone.replace(/\D/g, '')}`)}>
                  <Text style={styles.resourceLink}><Ionicons name="call-outline" size={16} color="#1e90ff" /> {resource.phone}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    margin: 10,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resourceItem: {
    marginBottom: 15,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  resourceDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    paddingLeft: 34, // Align with the icon
  },
  resourceLink: {
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginLeft: 34, // Align with the icon
  }
});
