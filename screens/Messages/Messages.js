import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loader from '../../components/Loader';
import MessageList from '../../components/MessageList';
import { MaterialIcons } from '@expo/vector-icons';

const View = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
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
        from {
          id
          avatar
          username
        }
        to {
          id
          avatar
          username
        }
      }
    }
  }
`;

const Messages = ({ navigation }) => {
  const { data, loading } = useQuery(SEE_ROOMS, {
    fetchPolicy: 'network-only'
  });

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

Messages.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Direct',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation.dismiss()}
      style={{
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <MaterialIcons name='close' color='#000' size={25} />
    </TouchableOpacity>
  )
});

export default Messages;
