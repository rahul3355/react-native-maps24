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
        console.log("Current User Location: ", location.coords.latitude, location.coords.longitude);
      }
    
      useEffect(() => {
        userLocation();
      }, []);
    
      return (
        <View style={styles.container}>
          <MapView style={styles.map} region={mapRegion}>
            <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} title='Marker' />
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
