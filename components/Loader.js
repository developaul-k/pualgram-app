import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import styles from '../styles';
import constants from '../constants';

const Container = styled.View`
  width: ${constants.width};
  height: ${constants.height - 110};
  justify-content: center;
  align-items: center;
`;

export default () => (
  <Container>
    <ActivityIndicator color={styles.blackColor} />
  </Container>
);
