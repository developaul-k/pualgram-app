import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import styled from 'styled-components';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import styles from '../styles';
import constants from '../constants';
import SquarePhoto from './SquarePhoto';
import Post from './Post';
import { useLogOut } from '../AuthContext';

const ProfileHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const HeaderColumn = styled.View``;
const Avatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;
const ProfileStatus = styled.View`
  flex-direction: row;
`;
const Stat = styled.View`
  align-items: center;
  margin-left: 40px;
`;
const Bold = styled.Text`
  font-weight: 600;
`;
const StatName = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: ${styles.darkGreyColor};
`;
const ProfileMeta = styled.View`
  margin-top: 10px;
  padding: 0 20px;
`;
const Bio = styled.Text``;
const ButtonContainer = styled.View`
  flex-direction: row;
  margin-top: 30px;
`;
const Button = styled.View`
  width: ${constants.width / 2};
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;
const PostContainer = styled.View`
  flex-direction: ${props => (props.isGrid ? 'row' : 'column')};
`;

const UserProfile = ({
  avatar,
  postsCount,
  followersCount,
  followingCount,
  bio,
  fullName,
  posts
}) => {
  const logout = useLogOut();
  const [isGrid, setIsGrid] = useState(true);
  const toggleGrid = () => setIsGrid(i => !i);
  return (
    <View>
      <ProfileHeader>
        <Touchable onPress={logout}>
          <Avatar source={{ uri: `${constants.devServer}${avatar}` }} />
        </Touchable>
        <HeaderColumn>
          <ProfileStatus>
            <Stat>
              <Bold>{postsCount}</Bold>
              <StatName>posts</StatName>
            </Stat>
            <Stat>
              <Bold>{followersCount}</Bold>
              <StatName>Followers</StatName>
            </Stat>
            <Stat>
              <Bold>{followingCount}</Bold>
              <StatName>Following</StatName>
            </Stat>
          </ProfileStatus>
        </HeaderColumn>
      </ProfileHeader>
      <ProfileMeta>
        <Bold>{fullName}</Bold>
        <Bio>{bio}</Bio>
      </ProfileMeta>
      <ButtonContainer>
        <Touchable onPress={toggleGrid}>
          <Button>
            <Ionicons
              color={isGrid ? styles.black : styles.darkGreyColor}
              size={32}
              name={Platform.OS === 'ios' ? 'ios-grid' : 'md-grid'}
            />
          </Button>
        </Touchable>
        <Touchable onPress={toggleGrid}>
          <Button>
            <Ionicons
              color={!isGrid ? styles.black : styles.darkGreyColor}
              size={32}
              name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'}
            />
          </Button>
        </Touchable>
      </ButtonContainer>
      <PostContainer isGrid={isGrid}>
        {posts &&
          posts.map(post =>
            isGrid ? (
              <SquarePhoto key={post.id} {...post} />
            ) : (
              <Post key={post.id} {...post} />
            )
          )}
      </PostContainer>
    </View>
  );
};

UserProfile.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  bio: PropTypes.string.isRequired,
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
  firstName: PropTypes.string,
  lastName: PropTypes.string
};

export default UserProfile;
