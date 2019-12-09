import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import constants from '../constants';

const SquarePhoto = ({ navigation, files = [], id }) =>
  <TouchableOpacity onPress={() => navigation.navigate('Detail', { id })}>
    <Image
      source={{
        uri:
          files[0].url.indexOf('http') === -1
            ? `${constants.devServer}${files[0].url}`
            : files[0].url
      }}
      style={{ width: constants.width / 3, height: constants.width / 3 }}
    />
  </TouchableOpacity>;

SquarePhoto.propTypes = {
  id: PropTypes.string.isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired
};

export default withNavigation(SquarePhoto);
