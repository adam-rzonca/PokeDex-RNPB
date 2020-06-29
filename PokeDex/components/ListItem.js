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
import {fetchPokemon} from '../apiService';

export const ListItem = ({navigation, item, index, isRefreshing}) => {
  const [pokemon, setPokemon] = useState(null);
  useEffect(() => {
    // const controller = new AbortController();
    // const signal = controller.signal;

    (async () => {
      //   const response = await fetchPokemon(item.url, signal);
      const response = await fetchPokemon(item.url);

      setPokemon(response);
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
          source={{uri: pokemon.sprites.front_default}}
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
