import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';
import constants from '../constants';
import styles from '../styles';

// const TextInput = styled.TextInput``;

const SearchBar = ({ value, onChange, onSubmit }) => (
  <TextInput
    style={{
      width: constants.width - 40,
      height: 35,
      backgroundColor: styles.lightGreyColor,
      padding: 10,
      borderRadius: 5,
      textAlign: 'center'
    }}
    returnKeyType='search'
    onChangeText={onChange}
    onSubmitEditing={onSubmit}
    value={value}
    placeholder='Search'
    placeholderTextColor={styles.darkGreyColor}
  />
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SearchBar;
