import React, { useState, useEffect, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Animated,
  FlatList,
  Keyboard,
  View
} from 'react-native';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import useInput from '../hooks/useInput';
import useClientNode from '../hooks/useClientNode';
import CommentBox from '../components/CommentBox';
import Comment from '../components/Comment';
import Loader from '../components/Loader';
import constants from '../constants';

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
  const postId = navigation.getParam('postId');
  const avatar = navigation.getParam('avatar');
  const username = navigation.getParam('username');
  const caption = navigation.getParam('caption');
  const [keyboardHeight, setKeyboardHeight] = useState('auto');
  const [sComments, setScomments] = useState([
    { user: { avatar, username }, text: caption, type: 'caption' }
  ]);

  const commentInput = useInput('');

  const [commentNode, commentRef] = useClientNode();
  const [flatNode, flatRef] = useClientNode();

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
    }
  }, []);

  const keyboardDidShow = async e => {
    // e.endCoordinates.height
    await setKeyboardHeight(constants.height / 2);
  };

  const keyboardDidHide = e => {
    setKeyboardHeight('auto');
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    if (data && data.seeComments) {
      setScomments(prev => [...prev, ...data.seeComments]);
    }
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide);
    };
  }, [data, flatNode]);

  return loading ? (
    <Loader />
  ) : (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={88}
      style={{ flex: 1 }}
    >
      <FlatList
        ref={flatRef}
        data={sComments}
        renderItem={({ item }) => (
          <Comment
            avatarUri={item.user.avatar}
            username={item.user.username}
            caption={item.text}
            type={item.type && item.type}
          />
        )}
        keyExtractor={(item, index) => index}
        onContentSizeChange={() => {
          // 처음 렌더링 시에만 호출
          flatNode.scrollToEnd();
        }}
        onLayout={() => {
          // 레이아웃이 변경될 떄 마다 호출
          flatNode.scrollToEnd();
        }}
      />
      <CommentBox
        avatarUri={avatar}
        addComment={addComment}
        commentInput={commentInput}
        loading={addCommentLoading}
        commentRef={commentRef}
      />
    </KeyboardAvoidingView>
  );
};
