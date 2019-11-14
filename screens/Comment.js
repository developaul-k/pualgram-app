import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import useInput from '../hooks/useInput';
import CommentBox from '../components/CommentBox';
import Comment from '../components/Comment';
import Loader from '../components/Loader';

const Container = styled.View`
  flex: 1;
`;

const FakeContainer = styled.View`
  height: 50px;
  background-color: transparent;
`;

const ADD_COMMENT = gql`
  mutation addComment($text: String!, $postId: String!) {
    addComment(text: $text, postId: $postId) {
      id
      text
      user {
        id
        avatar
        username
      }
    }
  }
`;

const SEE_COMMENTS = gql`
  query seeComments($postId: String!) {
    seeComments(postId: $postId) {
      id
      text
      user {
        id
        avatar
        username
      }
    }
  }
`;

export default ({ navigation }) => {
  const [sComments, setScomments] = useState([]);
  const postId = navigation.getParam('postId');
  const avatar = navigation.getParam('avatar');
  const username = navigation.getParam('username');
  const caption = navigation.getParam('caption');

  const commentInput = useInput('');
  const scrollViewRef = useRef();
  const keyRef = useRef();

  const { loading, data } = useQuery(SEE_COMMENTS, {
    variables: {
      postId
    },
    fetchPolicy: 'network-only'
  });

  const [addCommentMutation, { loading: addCommentLoading }] = useMutation(
    ADD_COMMENT,
    {
      update(
        cache,
        {
          data: { addComment }
        }
      ) {
        commentInput.setValue('');
        setScomments(prev => [...prev, addComment]);
      }
    }
  );

  const addComment = useCallback(async comment => {
    if (comment.trim() !== '') {
      await addCommentMutation({
        variables: {
          text: comment,
          postId
        }
      });
      setTimeout(() => scrollViewRef.current.scrollToEnd(), 0);
    }
  }, []);

  const keyboardShown = useCallback(() => {
    scrollViewRef.current !== null && scrollViewRef.current.scrollToEnd();
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', keyboardShown);

    return () => {
      Keyboard.removeListener('keyboardWillShow', keyboardShown);
    };
  }, []);

  useEffect(() => {
    if (data && data.seeComments) {
      setScomments(data.seeComments);
    }
  }, [data]);

  return loading ? (
    <Loader />
  ) : (
    <Container>
      <KeyboardAvoidingView
        behavior='padding'
        enabled
        keyboardVerticalOffset={100}
        ref={keyRef}
      >
        <ScrollView
          keyboardDismissMode='none'
          keyboardShouldPersistTaps='never'
          ref={scrollViewRef}
        >
          <Container>
            <Comment
              avatarUri={avatar}
              username={username}
              caption={caption}
              type='caption'
            />
            {sComments &&
              sComments.length > 0 &&
              sComments.map(comment => (
                <Comment
                  key={comment.id}
                  avatarUri={comment.user.avatar}
                  username={comment.user.username}
                  caption={comment.text}
                />
              ))}
            <FakeContainer />
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
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
        <CommentBox
          avatarUri={avatar}
          addComment={addComment}
          commentInput={commentInput}
          loading={addCommentLoading}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};
