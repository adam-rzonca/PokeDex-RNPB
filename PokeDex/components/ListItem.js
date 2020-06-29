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

import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';

import {fetchPokemon} from '../apiService';
import {useAsyncStorage} from '../hooks/useAsyncStorage';

export const ListItem = ({navigation, item, index, isRefreshing}) => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    // const controller = new AbortController();
    // const signal = controller.signal;

    (async () => {
      //   const response = await fetchPokemon(item.url, signal);
      if (item) {
        console.log(item.url);

        const response = await fetchPokemon(item.url);

        // const base64Image = await ImgToBase64.getBase64String(
        //   response.sprites.front_default,
        // );

        const result = await RNFetchBlob.fetch(
          'GET',
          response.sprites.front_default,
        );

        const base64Image = result.data;
        console.log(base64Image);

        response.base64Image = base64Image;

        setPokemon(response);
      }
    })();
    // return () => controller.abort();
  }, []);

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
      onPress={() => navigation.navigate('Details')}
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
