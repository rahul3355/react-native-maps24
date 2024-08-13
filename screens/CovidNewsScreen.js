// screens/CovidNewsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, StyleSheet, ActivityIndicator } from 'react-native';

export default function CovidNewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/everything?q=covid&sortBy=publishedAt&language=en&apiKey=8784c87650484c66814feadac36a6a0e'
        );
        const data = await response.json();
        console.log("Fetched News Data:", data);

        if (data.articles) {
          // Filter out articles that don't have an image
          const filteredArticles = data.articles.filter(article => article.urlToImage);
          setNews(filteredArticles);
        } else {
          console.error("No articles found in the response.");
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching latest news...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={news}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.urlToImage }} style={styles.image} />
          <View style={styles.cardContent}>
            <Text style={styles.headline}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <Text style={styles.link}>Read more</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#555',
  },
  card: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 15,
  },
  headline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  link: {
    marginTop: 10,
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});
