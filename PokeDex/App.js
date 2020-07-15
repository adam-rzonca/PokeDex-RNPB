import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './screens/HomeScreen';
import {DetailsScreen} from './screens/DetailsScreen';
import {BerriesScreen} from './screens/BerriesScreen';
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

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color}) => {
            let imageUrl;
            if (route.name === 'Home') {
              console.log('Home', color);
              imageUrl = require('./images/home.png');
            } else {
              console.log('Berries', color);
              imageUrl = require('./images/berries.png');
            }

            // Poczytać o SVG, bo on może wyszarzać

            return <Image source={imageUrl} tintColor={color} />;
          },
        })}
        tabBarOptions={{activeTintColor: 'black', inactiveTintColor: 'gray'}}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Berries" component={BerriesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
