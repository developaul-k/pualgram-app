import React from 'react';
import styled from 'styled-components';

export default () => {
  const View = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
  `;
  const Text = styled.Text``;

  return (
    <View>
      <Text>Messages Screen</Text>
    </View>
  );
};
