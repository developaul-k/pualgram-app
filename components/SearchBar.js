import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import constants from '../constants';
import styles from '../styles';

const View = styled.View`
  width: ${constants.width};
  justify-content: center;
  align-items: center;
`;
const TextInput = styled.TextInput`
  width: ${constants.width - 40};
  height: 35px;
  background-color: ${styles.lightGreyColor};
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`;

const SearchBar = ({ value, onChange, onSubmit }) => (
  <View>
    <TextInput
      returnKeyType='search'
      onChangeText={onChange}
      onSubmitEditing={onSubmit}
      value={value}
      placeholder='Search'
      placeholderTextColor={styles.darkGreyColor}
    />
  </View>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SearchBar;
