import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import Avatar from '../../components/Avatar';

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
  `}
`;

const Row = styled.View`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Column = styled.View`
  ${props =>
    props.flex &&
    `
    flex-direction: row;
    align-items: center;
  `}
`;

const Image = styled.Image`
  width: 40px;
  height: 40px;
`;

const Text = styled.Text`
  margin-left: 10px;
`;

export default ({ navigation }) => {
  const [getNotifications, { loading, data, refetch }] = useLazyQuery(
    SEE_NOTIFICATIONS,
    {
      fetchPolicy: 'network-only'
    }
  );
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

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

  return (
    <ScrollView
      style={
        data &&
        data.seeNotifications &&
        data.seeNotifications.length === 0 && {
          justifyContent: 'center',
          alignItems: 'center'
        }
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      {loading ? (
        <Loader />
      ) : data && data.seeNotifications && data.seeNotifications.length > 0 ? (
        <Container>
          {data.seeNotifications.map(notification => (
            <Row>
              <Column flex>
                <Column>
                  <Avatar
                    uri={`http://localhost:4000${notification.creator.avatar}`}
                  />
                </Column>
                <Column>
                  <Text>
                    {notification.creator.username}님이 회원님의 사진을
                    좋아합니다.
                  </Text>
                </Column>
              </Column>
              <Column>
                {notification.post.files.map(file => (
                  <Image
                    key={file.id}
                    source={{
                      uri:
                        file.url.indexOf('http') === -1
                          ? 'http://localhost:4000' + file.url
                          : file.url
                    }}
                  />
                ))}
              </Column>
            </Row>
          ))}
        </Container>
      ) : (
        <Text>받은 알림이 없습니다.</Text>
      )}
    </ScrollView>
  );
};
