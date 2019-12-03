import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
    flex-direction: row;
    align-items: center;
  `};
`;

const Image = styled.Image`
  width: 40px;
  height: 40px;
`;

const Text = styled.Text`margin-left: 10px;`;

const Notification = ({ creator, post, index }) =>
  <Row key={index}>
    <Column columnFlex>
      <Column>
        <Avatar uri={`${constants.devServer}${creator.avatar}`} />
      </Column>
      <Column>
        <Text>
          {creator.username}님이 회원님의 사진을 좋아합니다.
        </Text>
      </Column>
    </Column>
    <Column>
      {post.files.map((file, index) =>
        <Image
          key={index}
          source={{
            uri:
              file.url.indexOf('http') === -1
                ? `${constants.devServer}${file.url}`
                : file.url
          }}
        />
      )}
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
