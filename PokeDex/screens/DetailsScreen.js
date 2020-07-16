import React from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';

import {useAsyncStorage} from '../hooks/useAsyncStorage';
import {AnimatedBar} from '../components/AnimatedBar';

const PokemonKey = '@pokedex_Pokemon_';

export const DetailsScreen = ({route}) => {
  const {name} = route.params;
  const [pokemonSource, setPokemonSource] = useAsyncStorage(PokemonKey + name);

  if (!pokemonSource) return <ActivityIndicator />;
  return (
    <View style={styles.container}>
      <Image
        source={{uri: `data:image/png;base64,${pokemonSource.base64Image}`}}
        style={styles.image}
      />
      <Text>{name}</Text>
      {pokemonSource.stats.map((item, index) => (
        <View key={index} style={styles.statsContainer}>
          <Text styles={styles.statsText}>
            {item.stat.name.toUpperCase()}: {item.base_stat}
          </Text>
          <AnimatedBar value={item.base_stat} index={index} />
        </View>
      ))}
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
  image: {
    width: 150,
    height: 150,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statsText: {
    marginRight: 20,
  },
};
