import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  //   AbortController,
} from 'react-native';

import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';

import {fetchPokemon} from '../apiService';
import {useAsyncStorage} from '../hooks/useAsyncStorage';

const PokemonKey = '@pokedex_Pokemon_';

export const ListItem = ({navigation, item, index, isRefreshing}) => {
  const key = PokemonKey + item.name;

  const [pokemon, setPokemon] = useState(null);
  const [pokemonSource, setPokemonSource] = useAsyncStorage(key);

  useEffect(() => {
    (async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      let storedPokemon = await AsyncStorage.getItem(key);

      if (storedPokemon == null) {
        const response = await fetchPokemon(item.url, signal);

        const result = await RNFetchBlob.fetch(
          'GET',
          response.sprites.front_default,
        );

        const base64Image = result.data;
        response.base64Image = base64Image;

        storedPokemon = response;
        setPokemonSource(storedPokemon);
      }

      setPokemon(pokemonSource);

      return () => controller.abort();
    })();
  }, [pokemonSource]);

  const renderDetails = () => {
    if (!pokemon) {
      return <ActivityIndicator size="small" />;
    }
    return (
      <>
        <Image
          style={styles.image}
          //source={{uri: pokemon.sprites.front_default}}
          source={{uri: `data:image/png;base64,${pokemon.base64Image}`}}
        />
        <Text>{pokemon.id}</Text>
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', {name: pokemon.name})}
      //onPress={() => Alert.alert(item.name, item.url)}
      key={index}
      style={[
        styles.itemContainer,
        isRefreshing && styles.disableItemContainer,
      ]}>
      <Text style={styles.text}>{item.name}</Text>
      {renderDetails()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: '100',
  },
  itemContainer: {
    padding: 8,
  },
  disableItemContainer: {
    backgroundColor: '#eee',
  },
  image: {
    width: 50,
    height: 50,
  },
});
