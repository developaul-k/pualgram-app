import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import Notification from '../../components/Notification';
import EmptyList from '../../components/EmptyList';

const SEE_NOTIFICATIONS = gql`
  {
    seeNotifications {
      id
      creator {
        id
        avatar
        username
      }
      post {
        id
        files {
          id
          url
        }
        user {
          id
          avatar
          username
        }
      }
      notificationType
    }
  }
`;

const Container = styled.View`
  ${props =>
    props.none &&
    `
    flex: 1;
    justify-content: center;
    align-items: center;
  `};
`;

export default ({ navigation }) => {
  const [
    getNotifications,
    { loading, data, refetch, networkStatus }
  ] = useLazyQuery(SEE_NOTIFICATIONS);

  useEffect(() => {
    getNotifications();
    // 탭 전환 시에 componentDidUnmout가 일어나지 않음 반대로 componentDidMount도 초기에 접근할 떄만 호출 됨
    const willFoucsSubscription = navigation.addListener('willFocus', () => {
      getNotifications();
    });
    return () => {
      willFoucsSubscription.remove();
    };
  }, []);

  return loading
    ? <Loader />
    : <Container>
        <FlatList
          onRefresh={refetch}
          refreshing={networkStatus === 4}
          data={data && data.seeNotifications}
          renderItem={({ item, index }) =>
            <Notification {...item} index={index} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => <EmptyList caption="받은 알림이 없습니다." />}
        />
      </Container>;
};
