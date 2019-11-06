import React, { useState, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import useInput from '../hooks/useInput';
import CommentBox from '../components/CommentBox';
import Avatar from '../components/Avatar';
import Comment from '../components/Comment';

const Container = styled.View`
  flex: 1;
`;

export default ({ navigation }) => {
  const comment = useInput('');
  const comments = navigation.getParam('comments', []);
  const avatarUri = navigation.getParam('avatar');
  const username = navigation.getParam('username', 'dummy');
  const caption = navigation.getParam('caption', 'dummy');

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Comment
            avatarUri={avatarUri}
            username={username}
            caption={caption}
          />
          {comments &&
            comments.length > 0 &&
            comments.map(comment => (
              <Comment
                key={comment.id}
                avatarUri={comment.user.avatar}
                username={comment.user.username}
                caption={caption}
              />
            ))}
        </Container>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior='position'
        enabled
        keyboardVerticalOffset={88}
        contentContainerStyle={{
          position: 'absolute',
          bottom: 0,
          justifyContent: 'flex-end'
        }}
      >
        <CommentBox avatarUri={avatarUri} {...comment} />
      </KeyboardAvoidingView>
    </Container>
  );
};
