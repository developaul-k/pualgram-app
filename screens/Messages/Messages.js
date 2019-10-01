import React, { useState } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import Loader from '../../components/Loader';
import MessageList from '../../components/MessageList';

const View = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
`;
const Text = styled.Text`
  font-size: 15px;
`;

const SEE_ROOMS = gql`
  {
    seeRooms {
      id
      participants {
        id
        username
        avatar
      }
      messages {
        id
        text
      }
    }
  }
`;

export default () => {
  const { data, loading } = useQuery(SEE_ROOMS);

  return (
    <View>
      {loading ? (
        <Loader />
      ) : (
        data &&
        data.seeRooms.map(room => <MessageList key={room.id} {...room} />)
      )}
    </View>
  );
};
