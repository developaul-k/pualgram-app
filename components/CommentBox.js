import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './Avatar';
import constants from '../constants';
import Loader from './Loader';

const Container = styled.View`
  padding: 5px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.lightGreyColor};
  background-color: ${props => props.theme.whiteColor};
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
  ${props =>
    props.disabled &&
    `
    opacity: 0.5;
  `}
`;

const Text = styled.Text`
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.blueColor};
`;

const CommentBox = ({
  avatarUri,
  addComment,
  commentInput,
  loading,
  commentRef
}) => {
  return (
    <Container>
      <Avatar uri={`${constants.devServer}${avatarUri}`} />
      <CommentInput
        onChangeText={commentInput.onChange}
        value={commentInput.value}
        multiline={true}
        autoFocus={true}
        placeholder='댓글달기'
        autoCapitalize='none'
        autoCompleteType='off'
        autoCorrect={false}
        ref={commentRef}
      />
      <Touchable
        onPress={() => addComment(commentInput.value)}
        disabled={commentInput.value === ''}
      >
        {loading ? <Loader /> : <Text>게시</Text>}
      </Touchable>
    </Container>
  );
};

CommentBox.propTypes = {
  avatarUri: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
  commentInput: PropTypes.objectOf(
    PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      setValue: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  loading: PropTypes.bool.isRequired
};

export default CommentBox;
