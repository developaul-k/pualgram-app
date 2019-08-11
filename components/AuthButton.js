import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Touchable = styled.TouchableOpacity``;
const Container = styled.View`
  margin: 0 50px;
  padding: 10px 0;
  width: ${constants.width - 100};
  border-radius: 4px;
  background-color: ${props => props.theme.blueColor};
`;
const Text = styled.Text`
  font-weight: 600;
  text-align: center;
  color: #fff;
`;
const AuthButton = ({ text, onPress, loading = false }) => (
  <Touchable disabled={loading} onPress={onPress}>
    <Container>
      {loading ? <ActivityIndicator color={'white'} /> : <Text>{text}</Text>}
    </Container>
  </Touchable>
);

AuthButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

export default AuthButton;
