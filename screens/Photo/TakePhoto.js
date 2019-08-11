import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';

export default ({ navigation }) => {
  const View = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
  `;
  const Text = styled.Text``;

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("UploadPhoto")}>
        <Text>Take</Text>
      </TouchableOpacity>
    </View>
  );
};
