import React from 'react';
import styled from 'styled-components';
import { Text } from 'react-native';

export default () => {
  const View = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
  `;
  const Text = styled.Text``;

  return (
    <View>
      <Text>Select Photo</Text>
    </View>
  );
};
