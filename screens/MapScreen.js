import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Button } from "react-native";
import * as Location from 'expo-location';

const MapScreen = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    fetchNearbyPlaces(location.coords.latitude, location.coords.longitude);
  }

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="hospital"](around:10000,${latitude},${longitude});
        node["amenity"="clinic"](around:10000,${latitude},${longitude});
        node["amenity"="doctors"](around:10000,${latitude},${longitude});
      );
      out body;
    `;
    try {
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
      const data = await response.json();
      setPlaces(data.elements);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    userLocation();
  }, []);

  const getMarkerColor = (amenity) => {
    switch (amenity) {
      case 'hospital':
        return 'yellow';
      case 'clinic':
        return 'blue';
      case 'doctors':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
        <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} title='Your Location' />
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.lat,
              longitude: place.lon,
            }}
            pinColor={getMarkerColor(place.tags.amenity)}
            title={place.tags.name || 'Unnamed Place'}
            description={place.tags.amenity}
          />
        ))}
      </MapView>
      <Button title="Get location" onPress={userLocation} />
    </View>
  );
}

export default MapScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
