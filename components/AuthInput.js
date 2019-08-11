import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import constants from '../constants';

const Container = styled.View`
  margin-bottom: 10px;
`;
const TextInput = styled.TextInput`
  width: ${constants.width - 100};
  padding: 10px;
  border: 1px solid ${props => props.theme.darkGreyColor};
  background-color: ${props => props.theme.greyCOlor};
  border-radius: 4px;
`;

const AuthInput = ({
  placeholder,
  value,
  keyboardType = 'default',
  autoCapitalize = 'none',
  onChange,
  returnKeyType = 'done',
  onSubmitEditing = () => null,
  autoCorrect = true
}) => (
  <Container>
    <TextInput
      onChangeText={onChange}
      placeholder={placeholder}
      value={value}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      autoCorrect={autoCorrect}
    />
  </Container>
);

AuthInput.propTypes = {
  placeholer: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad'
  ]),
  autoCapitalize: PropTypes.oneOf(['characters', 'words', 'sentences', 'none']),
  onChange: PropTypes.func.isRequired,
  returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
  onSubmitEditing: PropTypes.func,
  autoCorrect: PropTypes.bool
};

export default AuthInput;
