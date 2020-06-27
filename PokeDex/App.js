import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {fetchPokemonsList} from './apiService';
import {useDebounce} from './hooks/useDebounce';

import {ListHeader} from './components/ListHeader';

const PokeListKey = '@pokedex_List';

const App = () => {
  const [data, setData] = useState([]);
  const [term, setTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(PokeListKey, jsonValue);
    } catch (error) {
      console.error('saving error', error);
    }
  };

  getData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('reading error', error);
    }
  };

  useEffect(() => {
    (async () => {
      const storedPokeList = await getData(PokeListKey);

      if (storedPokeList == null) {
        const response = await fetchPokemonsList();
        await storeData(response.results);
        setData(response.results);
      } else {
        setData(storedPokeList);
      }
    })();
  }, []);

  const debouncedSearchTerm = useDebounce(term, 250);

  useEffect(() => {
    (async () => {
      const storedPokeList = await getData(PokeListKey);
      if (debouncedSearchTerm) {
        const filteredList = filterPokemonsList(
          storedPokeList,
          debouncedSearchTerm,
        );
        setData(filteredList);
      } else {
        setData(storedPokeList);
      }
    })();
  }, [debouncedSearchTerm]);

  const filterPokemonsList = (list, term) => {
    return list.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase()),
    );
  };

  const refreshPokemonsList = async () => {
    setRefreshing(true);
    const response = await fetchPokemonsList();
    await storeData(response.results);
    setData(response.results);
    setTerm('');
    setRefreshing(false);
  };

  const barStyle = Platform.OS === 'ios' ? 'default' : 'light-content';

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor="black" />
      <SafeAreaView style={styles.appContainer}>
        <FlatList
          onRefresh={refreshPokemonsList}
          refreshing={refreshing}
          scrollEnabled={!refreshing}
          ListHeaderComponent={
            <ListHeader value={term} onChangeText={setTerm} />
          }
          data={data}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({item, index, separator}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(item.name, item.url);
                }}
                key={index}
                style={[
                  styles.itemContainer,
                  refreshing && styles.itemDisabled,
                ]}>
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
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
  text: {fontSize: 30, fontWeight: '100'},
  itemContainer: {padding: '8'},

  itemDisabled: {
    backgroundColor: 'gray',
  },
});

export default App;
