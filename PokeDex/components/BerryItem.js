import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
} from 'react-native';

import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';

import {fetchData} from '../apiService';
import {useAsyncStorage} from '../hooks/useAsyncStorage';

const BerryKey = '@pokedex_Berry_';

export const BerryItem = ({navigation, item, index, isRefreshing}) => {
  const key = BerryKey + item.name;

  const [berry, setBerry] = useState(null);
  const [berrySource, setBerrySource] = useAsyncStorage(key);

  useEffect(() => {
    (async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      let storedBerry = await AsyncStorage.getItem(key);

      if (storedBerry == null) {
        const response = await fetchData(item.url, signal);

        storedBerry = response;
        setBerrySource(storedBerry);
      }

      setBerry(berrySource);

      return () => controller.abort();
    })();
  }, [berrySource]);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', {name: berry.name})}
      //onPress={() => Alert.alert(item.name, item.url)}
      key={index}
      style={[
        styles.itemContainer,
        isRefreshing && styles.disableItemContainer,
      ]}>
      <Text style={styles.text}>{item.name}</Text>
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
