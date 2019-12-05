import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'moment/locale/ko';
import moment from 'moment';
import Avatar from './Avatar';
import constants from '../constants';

const Row = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Column = styled.View`
  ${props =>
    props.columnFlex &&
    `
    width: ${constants.width - 110};
    flex-direction: row;
    align-items: center;
  `};
`;

const Image = styled.Image`
  width: 40px;
  height: 40px;
`;

const Text = styled.Text`margin-left: 10px;`;
const TimeStamp = styled.Text`
  font-size: 12px;
  color: #888;
`;

const Notification = ({
  creator,
  post,
  index,
  notificationType,
  comment,
  createdAt
}) =>
  <Row key={index}>
    <Column columnFlex>
      <Column first={true}>
        <Avatar uri={`${constants.devServer}${creator.avatar}`} />
      </Column>
      <Column>
        <Text ellipsizeMode="tail" numberOfLines={3}>
          {notificationType === 'LIKE' &&
            `${creator.username}님이 회원님의 사진을 좋아합니다.`}
          {notificationType === 'COMMENT' &&
            <Text>
              {creator.username}님이 회원님이 댓글을 남겼습니다: {comment}{' '}
              <TimeStamp>{moment(createdAt).fromNow()}</TimeStamp>
            </Text>}
        </Text>
      </Column>
    </Column>
    <Column>
      <Image
        source={{
          uri:
            post.files[0].url.indexOf('http') === -1
              ? `${constants.devServer}${post.files[0].url}`
              : post.files[0].url
        }}
      />
    </Column>
  </Row>;

Notification.propTypes = {
  creator: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }).isRequired,
  post: PropTypes.shape({
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
    ).isRequired
  })
};

export default Notification;
