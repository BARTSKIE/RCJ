import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { View, Text, Button } from 'react-native';

import WelcomeScreen from './screens/WelcomeScreen';
import AppointmentSchedule from './screens/AppointmentSchedule';
import AppointmentStatus from './screens/AppointmentStatus';
import StaffDoctorInfo from './screens/StaffDoctorInfo';
import LoginScreen from './screens/handleLogin';

const Drawer = createDrawerNavigator();
const auth = getAuth();

function LogoutScreen({ navigation }) {
  useEffect(() => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Logging out...</Text>
    </View>
  );
}

export default function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Welcome">
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="Appointment Schedule" component={AppointmentSchedule} />
      <Drawer.Screen name="Appointment Status" component={AppointmentStatus} />
      <Drawer.Screen name="Staff and Doctor Info" component={StaffDoctorInfo} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
}
