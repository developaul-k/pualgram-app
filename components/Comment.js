import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './Avatar';

const Container = styled.View`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.lightGreyColor};
  flex-direction: row;
  align-items: center;
`;

const Username = styled.Text`
  margin-left: 5px;
  font-weight: 700;
  font-size: 12px;
  color: ${props => props.theme.blackColor};
`;

const Text = styled.Text`
  margin-left: 5px;
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.blackColor};
`;

const Comment = ({ avatarUri, username, caption }) => {
  return (
    <Container>
      <Avatar uri={`http://localhost:4000${avatarUri}`} />
      <Username>{username}</Username>
      <Text>{caption}</Text>
    </Container>
  );
};

Comment.propTypes = {
  avatarUri: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
};

export default Comment;
