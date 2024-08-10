import React, { useState, useEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

const CovidMapScreen = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 51.5074, // Default to London coordinates
    longitude: -0.1278,
    latitudeDelta: 10.0, // Increased delta to cover a larger area
    longitudeDelta: 10.0, // Increased delta to cover a larger area
  });
  const [covidData, setCovidData] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://covid-api.com/api/reports?date=2021-12-20&iso=GBR');
      const result = await response.json();
      const validData = result.data.filter(location => 
        !isNaN(parseFloat(location.region.lat)) && !isNaN(parseFloat(location.region.long))
      );
      setCovidData(validData);
    } catch (error) {
      console.error('Error fetching COVID data:', error);
      setErrorMsg('Failed to fetch COVID data');
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        {covidData.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ 
              latitude: parseFloat(location.region.lat), 
              longitude: parseFloat(location.region.long) 
            }}
            title={location.region.province || "Unknown"}
          >
            <Callout>
              <View>
                <Text>Province: {location.region.province || "Unknown"}</Text>
                <Text>Confirmed Cases: {location.confirmed}</Text>
                <Text>Deaths: {location.deaths}</Text>
                <Text>Active Cases: {location.active}</Text>
                <Text>Last Update: {location.last_update}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default CovidMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
