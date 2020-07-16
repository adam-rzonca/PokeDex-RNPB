import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './screens/HomeScreen';
import {DetailsScreen} from './screens/DetailsScreen';
import {BerriesScreen} from './screens/BerriesScreen';
import {BerryDetails} from './screens/BerryDetails';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Navigator>
);

const BerriesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Berries" component={BerriesScreen} />
    <Stack.Screen name="Details" component={BerryDetails} />
  </Stack.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color}) => {
            let imageUrl;
            if (route.name === 'Home') {
              imageUrl = require('./images/home.png');
            } else {
              imageUrl = require('./images/berries.png');
            }
            // Zapytać o tintColor...
            return <Image source={imageUrl} tintColor={color} />;
          },
        })}
        tabBarOptions={{activeTintColor: 'black', inactiveTintColor: 'gray'}}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Berries" component={BerriesStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
