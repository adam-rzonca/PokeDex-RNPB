import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

import {useAsyncStorage} from '../hooks/useAsyncStorage';
import {AnimatedBar} from '../components/AnimatedBar';

const BerryKey = '@pokedex_Berry_';

export const BerryDetails = ({route}) => {
  const {name} = route.params;
  const [berrySource, setBerrySource] = useAsyncStorage(BerryKey + name);

  if (!berrySource) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <Text>{name}</Text>
      {berrySource.flavors.map((item, index) => {
        return (
          <View key={index} style={styles.flavorContainer}>
            <Text styles={styles.flavorText}>
              {item.flavor.name.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  flavorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  flavorText: {
    marginRight: 20,
  },
};
