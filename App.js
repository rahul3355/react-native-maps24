import './gesture-handler';
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from './screens/DashboardScreen';
import MapScreen from './screens/MapScreen';
import HeatmapScreen from './screens/HeatmapScreen';
import CovidMapScreen from './screens/CovidMapScreen';
import ResourceFinderScreen from './screens/ResourceFinderScreen';
import MentalHealthScreen from './screens/MentalHealthScreen';
import CovidNewsScreen from './screens/CovidNewsScreen';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Dashboard" component={DashboardScreen}/>
        <Drawer.Screen name="MapScreen" component={MapScreen}/>
        <Drawer.Screen name="HeatmapScreen" component={HeatmapScreen} />
        <Drawer.Screen name="CovidMapScreen" component={CovidMapScreen}/>
        <Drawer.Screen name="ResourceFinderScreen" component={ResourceFinderScreen}/>
        <Drawer.Screen name="MentalHealthScreen" component={MentalHealthScreen} />
        <Drawer.Screen name="CovidNewsScreen" component={CovidNewsScreen} />
        
      </Drawer.Navigator>
    </NavigationContainer>
  );
}