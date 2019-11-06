import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './Avatar';
import constants from '../constants';

const Container = styled.View`
  padding: 5px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.lightGreyColor};
  flex-direction: row;
`;

const CommentInput = styled.TextInput`
  width: ${constants.width - 55};
  margin-left: 5px;
  padding: 10px 0 10px 10px;
  border: 1px solid ${props => props.theme.lightGreyColor};
  border-radius: 25px;
  background-color: 'blue';
`;

const Touchable = styled.TouchableOpacity`
  position: absolute;
  top: 5px;
  right: 15px;
  bottom: 5px;
  align-items: center;
  justify-content: center;
  ${props => props.disabled && `
    opacity: 0.5;
  `}
`;

const Text = styled.Text`
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.blueColor};
`;

const CommentBox = ({ avatarUri, onChange, value }) => {
  return (
    <Container>
      <Avatar uri={`http://localhost:4000${avatarUri}`} />
      <CommentInput
        onChangeText={onChange}
        value={value}
        multiline={true}
        autoFocus={true}
        placeholder='댓글달기'
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
      />
      <Touchable disabled={value === ''}>
        <Text>게시</Text>
      </Touchable>
    </Container>
  );
};

CommentBox.propTypes = {
  avatarUri: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default CommentBox;
