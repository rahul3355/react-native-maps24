import React from 'react';
import { View, Text, FlatList, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Use expo icons for better UI

const resources = [
  {
    category: "Food Delivery Services",
    data: [
      { name: "FoodPanda", contact: "123-456-7890", website: "https://www.foodpanda.com" },
      { name: "Uber Eats", contact: "098-765-4321", website: "https://www.ubereats.com" },
    ]
  },
  {
    category: "Pharmacies",
    data: [
      { name: "CVS Pharmacy", contact: "111-222-3333", website: "https://www.cvs.com" },
      { name: "Walgreens", contact: "444-555-6666", website: "https://www.walgreens.com" },
    ]
  },
  {
    category: "Online Mental Health Support",
    data: [
      { name: "BetterHelp", contact: "888-123-4567", website: "https://www.betterhelp.com" },
      { name: "Talkspace", contact: "800-123-4567", website: "https://www.talkspace.com" },
    ]
  },
  {
    category: "Legal Aid",
    data: [
      { name: "LegalZoom", contact: "999-888-7777", website: "https://www.legalzoom.com" },
      { name: "Rocket Lawyer", contact: "666-555-4444", website: "https://www.rocketlawyer.com" },
    ]
  },
];

export default function ResourceFinderScreen() {
  return (
    <FlatList
      data={resources}
      keyExtractor={(item) => item.category}
      renderItem={({ item }) => (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{item.category}</Text>
          {item.data.map((resource, index) => (
            <View key={index} style={styles.resourceItem}>
              <View style={styles.resourceHeader}>
                <Ionicons name="information-circle-outline" size={24} color="#333" />
                <Text style={styles.resourceName}>{resource.name}</Text>
              </View>
              <View style={styles.resourceDetails}>
                <Text style={styles.resourceContact}><Ionicons name="call-outline" size={16} color="#555" /> {resource.contact}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(resource.website)}>
                  <Text style={styles.resourceLink}><Ionicons name="link-outline" size={16} color="#1e90ff" /> Visit Website</Text>
                </TouchableOpacity>
              </View>
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
  resourceDetails: {
    paddingLeft: 34,  // Align with the icon
  },
  resourceContact: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  resourceLink: {
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
  }
});
