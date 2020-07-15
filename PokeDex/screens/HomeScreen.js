import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import {fetchPokemonsList} from '../apiService';
import {useDebounce} from '../hooks/useDebounce';
import {useAsyncStorage} from '../hooks/useAsyncStorage';
import {ListHeader} from '../components/ListHeader';
import {ListItem} from '../components/ListItem';

const PokeListKey = '@pokedex_List';

export const HomeScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [source, setSource] = useAsyncStorage(PokeListKey);

  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await AsyncStorage.getItem(PokeListKey);

      if (list == null) {
        const response = await fetchPokemonsList();
        setSource(response.results);
      }
      setData(source);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPokemonsList = async () => {
    setIsRefreshing(true);
    const response = await fetchPokemonsList();
    await setSource(response.results);
    setData(source);
    setIsRefreshing(false);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filterPokemons = useCallback(
    term =>
      source.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase()),
      ),
    [source],
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredPokemons = filterPokemons(debouncedSearchTerm);
      setData(filteredPokemons);
    } else {
      setData(source);
    }
  }, [debouncedSearchTerm, source, filterPokemons]);

  const barStyle = Platform.OS === 'ios' ? 'default' : 'light-content';

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor="black" />
      <SafeAreaView style={styles.appContainer}>
        <FlatList
          windowSize={5}
          onRefresh={refreshPokemonsList}
          refreshing={isRefreshing}
          ListHeaderComponent={<ListHeader onChange={setSearchTerm} />}
          data={data}
          scrollEnabled={!isRefreshing}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({item, index}) => {
            return (
              <ListItem
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
