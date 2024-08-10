import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet, View, Button, Modal, Text, ScrollView } from "react-native";
import * as Location from 'expo-location';
import axios from 'axios';
import polyline from '@mapbox/polyline';

const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN';

const MapScreen = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [travelTime, setTravelTime] = useState('');

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

  const handleMarkerPress = async (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
    const travelData = await fetchRoute(mapRegion.latitude, mapRegion.longitude, place.lat, place.lon);
    setRouteCoordinates(travelData.coordinates);
    setTravelTime(travelData.duration);
  };

  const fetchRoute = async (startLat, startLng, endLat, endLng) => {
    try {
      const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}`, {
        params: {
          access_token: 'sk.eyJ1IjoicmFodWxjc3MiLCJhIjoiY2x5enVidXl0MjB2bzJrc2d1ZjZia3IweiJ9.lRhBItOnYWBwlJwYrMZTMQ',
          geometries: 'polyline',
          overview: 'full'
        }
      });

      const data = response.data.routes[0];
      const coords = polyline.decode(data.geometry).map(([latitude, longitude]) => ({ latitude, longitude }));
      const duration = Math.round(data.duration / 60); // duration in minutes

      return { coordinates: coords, duration: `${duration} min` };
    } catch (error) {
      console.error(error);
      return { coordinates: [], duration: '' };
    }
  };

  useEffect(() => {
    userLocation();
  }, []);

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
            onPress={() => handleMarkerPress(place)}
          />
        ))}
        {routeCoordinates.length > 0 && (
          <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>
      <Button title="Get location" onPress={userLocation} />
      {selectedPlace && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.modalText}>{selectedPlace.tags.name || 'Unnamed Place'}</Text>
              <Text>Amenity: {selectedPlace.tags.amenity}</Text>
              {selectedPlace.tags.email && <Text>Email: {selectedPlace.tags.email}</Text>}
              {selectedPlace.tags.phone && <Text>Phone: {selectedPlace.tags.phone}</Text>}
              {selectedPlace.tags.website && <Text>Website: {selectedPlace.tags.website}</Text>}
              {selectedPlace.tags.opening_hours && <Text>Opening Hours: {selectedPlace.tags.opening_hours}</Text>}
              {travelTime && <Text>Approx Travel Time: {travelTime}</Text>}
              <Button
                title="Close"
                onPress={() => setModalVisible(!modalVisible)}
              />
            </ScrollView>
          </View>
        </Modal>
      )}
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 18,
  },
  scrollViewContent: {
    alignItems: 'center',
  }
});
