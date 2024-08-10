import React, { useState, useEffect } from "react";
import MapView, { Marker, Heatmap } from "react-native-maps";
import { StyleSheet, View, Button, Text } from "react-native";
import * as Location from 'expo-location';

const HeatmapScreen = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.5074, // Default to London coordinates
    longitude: -0.1278,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  const userLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false); // Set loading to false on error
        return;
      }

      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      await fetchCovidData(); // Ensure fetchCovidData is awaited
    } catch (error) {
      console.error('Error fetching user location:', error);
      setErrorMsg('Failed to fetch user location');
    } finally {
      setLoading(false); // Set loading to false after user location is fetched
    }
  };

  const fetchCovidData = async () => {
    try {
      const response = await fetch('https://covid-api.com/api/reports?date=2021-04-20&iso=GBR');
      const result = await response.json();
      const data = result.data;

      console.log('Received data:', data);

      const points = data
        .filter(item => item.region.lat && item.region.long && item.active > 0)
        .map((item) => {
          const latitude = parseFloat(item.region.lat);
          const longitude = parseFloat(item.region.long);
          const weight = item.active;

          console.log(`Parsed point: lat=${latitude}, long=${longitude}, weight=${weight}`);

          if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(weight)) {
            return { latitude, longitude, weight };
          }
          return null;
        })
        .filter(point => point !== null);

      console.log('Generated heatmap points:', points);

      setHeatmapPoints(points);
      setFetchError(null);
    } catch (error) {
      console.error('Error fetching COVID data:', error);
      setFetchError('Failed to fetch COVID data');
    }
  };

  useEffect(() => {
    userLocation();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <MapView style={styles.map} region={mapRegion}>
          <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} title='Your Location' />
          {heatmapPoints.length > 0 ? (
            <Heatmap
              points={heatmapPoints}
              opacity={1.0}
              radius={20}
              maxIntensity={100}
              gradient={{
                colors: ['rgba(102, 225, 0, 0.6)', 'rgba(255, 0, 0, 0.6)'],
                startPoints: [0.01, 0.05],
                colorMapSize: 256,
              }}
            />
          ) : (
            <Text>No data points for heatmap</Text>
          )}
        </MapView>
      )}
      <Button title="Get location" onPress={userLocation} />
      {errorMsg && <Text>{errorMsg}</Text>}
      {fetchError && <Text>{fetchError}</Text>}
    </View>
  );
};

export default HeatmapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
