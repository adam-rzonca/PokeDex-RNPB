import React from 'react';
import {View, Text, Image, ActivityIndicator} from 'react-native';

import {useAsyncStorage} from '../hooks/useAsyncStorage';

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
};
