// import React from 'react';
// import {View, Text} from 'react-native';

// export const BerriesScreen = () => {
//   return (
//     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       <Text>Berries Screen dane z endpointa w postaci flatlist</Text>
//     </View>
//   );
// };

import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  View,
  Text,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {fetchData} from '../apiService';
import {useDebounce} from '../hooks/useDebounce';
import {useAsyncStorage} from '../hooks/useAsyncStorage';
import {ListHeader} from '../components/ListHeader';
import {BerryItem} from '../components/BerryItem';

import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

const BerriesListKey = '@pokedex_Berries';
const url = 'https://pokeapi.co/api/v2/berry/';

export const BerriesScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [source, setSource] = useAsyncStorage(BerriesListKey);

  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      const list = await AsyncStorage.getItem(BerriesListKey);

      if (list == null) {
        const response = await fetchData(url, signal);
        setSource(response.results);
      }
      setData(source);

      return () => controller.abort();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshBerriesList = async () => {
    setIsRefreshing(true);
    const response = await fetchData(url);
    await setSource(response.results);
    setData(source);
    setIsRefreshing(false);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterBerries = useCallback(
    term =>
      source.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase()),
      ),
    [source],
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredBerries = filterBerries(debouncedSearchTerm);
      setData(filteredBerries);
    } else {
      setData(source);
    }
  }, [debouncedSearchTerm, source, filterBerries]);

  const barStyle = Platform.OS === 'ios' ? 'default' : 'light-content';

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor="black" />
      <SafeAreaView style={styles.appContainer}>
        <FlatList
          windowSize={5}
          onRefresh={refreshBerriesList}
          refreshing={isRefreshing}
          ListHeaderComponent={<ListHeader onChange={setSearchTerm} />}
          data={data}
          scrollEnabled={!isRefreshing}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({item, index}) => {
            return (
              <BerryItem
                navigation={navigation}
                item={item}
                index={index}
                isRefreshing={isRefreshing}
              />
            );
          }}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  container: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
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
});
