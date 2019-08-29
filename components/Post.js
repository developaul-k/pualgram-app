import React, { useState } from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import { gql } from 'apollo-boost';
import constants from '../constants';
import styles from '../styles';
import { useMutation } from 'react-apollo-hooks';

const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

const Container = styled.View``;

const Header = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;

const Touchable = styled.TouchableOpacity``;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: ${props => props.greyColor};
`;

const FeedImage = styled.Image`
  width: ${constants.width};
  height: ${constants.height / 2.5};
`;

const Bold = styled.Text`
  font-weight: 500;
`;

const Location = styled.Text`
  font-size: 12px;
`;

const IconsContainer = styled.View`
  margin-bottom: 5px;
  flex-direction: row;
`;

const IconContainer = styled.View`
  margin-right: 10px;
`;

const InfoContainer = styled.View`
  padding: 10px;
`;

const Caption = styled.Text`
  margin: 3px 0;
`;

const CommentCount = styled.Text`
  margin-top: 5px;
  opacity: 0.5;
  font-size: 12px;
`;

const Post = ({
  id,
  user,
  files = [],
  likeCount: likeCountProp,
  isLiked: isLikedProp,
  comments,
  location,
  caption,
  createdAt,
  direction,
  postType
}) => {
  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: {
      postId: id
    }
  });
  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount(l => l - 1);
    } else {
      setLikeCount(l => l + 1);
    }
    setIsLiked(p => !p);
    try {
      await toggleLikeMutation();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container>
      <Header>
        <Touchable>
          <Avatar source={{ uri: 'http://localhost:4000' + user.avatar }} />
        </Touchable>
        <Touchable>
          <HeaderUserContainer>
            <Bold>{user.username}</Bold>
            <Location>{location}</Location>
          </HeaderUserContainer>
        </Touchable>
      </Header>
      <Swiper style={{ height: constants.height / 2.5 }}>
        {files.map(file => (
          <FeedImage
            key={file.id}
            source={{
              uri:
                file.url.indexOf('http') === -1
                  ? 'http://localhost:4000' + file.url
                  : file.url
            }}
          />
        ))}
      </Swiper>
      <InfoContainer>
        <IconsContainer>
          <Touchable onPress={handleLike}>
            <IconContainer>
              <Ionicons
                name={
                  Platform.OS === 'ios'
                    ? isLiked
                      ? 'ios-heart'
                      : 'ios-heart-empty'
                    : isLiked
                    ? 'md-heart'
                    : 'md-heart-empty'
                }
                size={24}
                color={isLiked ? styles.dressColor : styles.blackColor}
              />
            </IconContainer>
          </Touchable>
          <Touchable>
            <IconContainer>
              <Ionicons
                name={Platform.OS === 'ios' ? 'ios-text' : 'md-text'}
                size={24}
                color={styles.blackColor}
              />
            </IconContainer>
          </Touchable>
        </IconsContainer>
        <Touchable>
          <Bold>{likeCount === 1 ? '1 like' : `${likeCount} likes`}</Bold>
        </Touchable>
        <Caption>
          <Bold>{user.username}</Bold> {caption}
        </Caption>
        <Touchable>
          <CommentCount>See all {comments.length} comments</CommentCount>
        </Touchable>
      </InfoContainer>
    </Container>
  );
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  ),
  location: PropTypes.string,
  caption: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  direction: PropTypes.string,
  postType: PropTypes.string
};

export default Post;
