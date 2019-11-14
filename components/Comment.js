import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './Avatar';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.lightGreyColor};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.View`
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

const Button = styled.TouchableOpacity``;

const Comment = ({ avatarUri, username, caption, type }) => {
  return (
    <Container>
      <Column>
        <Avatar uri={`http://localhost:4000${avatarUri}`} />
        <Username>{username}</Username>
        <Text>{caption}</Text>
      </Column>
      {type !== 'caption' && (
        <Button>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-heart-empty' : 'md-heart-empty'}
            size={15}
            color='#000'
          />
        </Button>
      )}
    </Container>
  );
};

Comment.propTypes = {
  avatarUri: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default Comment;
