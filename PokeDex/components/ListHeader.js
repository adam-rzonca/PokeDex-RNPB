import React from 'react';
import {View, TextInput} from 'react-native';

export const ListHeader = props => {
  return (
    <View>
      <TextInput
        placeholder="Search"
        value={props.value}
        onChangeText={props.onChangeText}
      />
    </View>
  );
};
