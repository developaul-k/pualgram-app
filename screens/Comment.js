import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, FlatList, Platform } from 'react-native';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import useInput from '../hooks/useInput';
import useClientNode from '../hooks/useClientNode';
import CommentBox from '../components/CommentBox';
import Comment from '../components/Comment';
import Loader from '../components/Loader';
import EmptyList from '../components/EmptyList';
import { FEED_QUERY } from './Tabs/Home';

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

  const [sComments, setScomments] = useState([
    { user: { avatar, username }, text: caption, type: 'caption' }
  ]);

  const commentInput = useInput('');

  const [flatNode, flatRef] = useClientNode();

  /**
   * Query - GET Comment
   */
  const { loading, data } = useQuery(SEE_COMMENTS, {
    variables: {
      postId
    },
    fetchPolicy: 'network-only'
  });

  /**
   * 코멘트 추가 후 Cache 업데이트 (상태관리)
   * @param { Object } cache
   * @param { Object } param1
   */
  const update = (cache, { data: { addComment } }) => {
    const { seeComments: previousQuery } = cache.readQuery({
      query: SEE_COMMENTS,
      variables: {
        postId
      }
    });

    const { seeFeed } = cache.readQuery({
      query: FEED_QUERY
    });

    seeFeed.map(feed => {
      if (feed.id === postId) {
        feed.comments = [...feed.comments, addComment];
      }
      return feed;
    });

    const data = {
      seeComments: [...previousQuery, addComment],
      seeFeed
    };

    cache.writeData({ data });
  };

  /**
   * Mutation - SET Comment
   */
  const [
    addCommentMutation,
    { loading: addCommentLoading }
  ] = useMutation(ADD_COMMENT, { update });

  /**
   * Action - 코멘트 추가
   */
  const addComment = useCallback(async comment => {
    if (comment.trim() !== '') {
      commentInput.setValue('');
      setScomments(prev => [
        ...prev,
        {
          id: `${new Date().getTime()}__${Math.random(1000)}`,
          text: comment,
          user: { avatar, username }
        }
      ]);
      await addCommentMutation({
        variables: {
          text: comment,
          postId
        }
      });
    }
  }, []);

  /**
   * SET - 코멘트 State에 추가
   */
  useEffect(
    () => {
      if (data && data.seeComments) {
        setScomments(prev => [...prev, ...data.seeComments]);
      }
    },
    [data]
  );

  return loading
    ? <Loader />
    : <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 81}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatRef}
          data={sComments}
          renderItem={({ item }) =>
            <Comment
              avatarUri={item.user.avatar}
              username={item.user.username}
              caption={item.text}
              type={item.type && item.type}
            />}
          keyExtractor={(_, idx) => `${idx}`}
          onContentSizeChange={() => {
            // 처음 렌더링 시에만 호출
            flatNode.scrollToEnd();
          }}
          onLayout={() => {
            // 레이아웃이 변경될 떄 마다 호출
            flatNode.scrollToEnd();
          }}
          ListEmptyComponent={() => <EmptyList caption="댓글이 없습니다." />}
        />
        <CommentBox
          avatarUri={avatar}
          addComment={addComment}
          commentInput={commentInput}
          loading={addCommentLoading}
        />
      </KeyboardAvoidingView>;
};
