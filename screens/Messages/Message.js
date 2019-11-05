import React, { useEffect, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components';
import gql from 'graphql-tag';
import moment from 'moment';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import Loader from '../../components/Loader';
import { USER_FRAGMENT } from '../../fragments';
import useInput from '../../hooks/useInput';

const View = styled.View`
  padding-top: 5px;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;
const MessageContainer = styled.View`
  padding-bottom: 50px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const MessageList = styled(ScrollView)`
  padding-bottom: 20px;
  width: 90%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
`;
const MessageColumn = styled.View`
  margin: 5px 0;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  ${props =>
    props.align === 'right' &&
    `
    align-items: center;
    justify-content: flex-end;
  `}
`;
const MessageColumnRight = styled(MessageColumn)`
  align-items: center;
  justify-content: flex-end;
`;
const MessageInput = styled.TextInput`
  padding-left: 10px;
  width: 90%;
  height: 40px;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-radius: 10px;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  ${props =>
    props.small &&
    `
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 15px;
  `}
  border: 1px solid #ccc;
  background-color: ${props => props.greyColor};
`;
const Text = styled.Text``;
const Username = styled(Text)`
  padding: 0 10px;
`;
const Time = styled.Text`
  margin-right: 10px;
  font-size: 11px;
  color: #aaa;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const HeaderText = styled(Text)`
  font-weight: 600;
`;

const SEE_ROOM = gql`
  query seeRoom($id: String!) {
    seeRoom(id: $id) {
      id
      participants {
        id
        username
        avatar
      }
    }
  }
`;

const MESSAGES = gql`
  query messages($id: String!) {
    messages(id: $id) {
      id
      text
      createdAt
      from {
        id
        username
      }
      to {
        id
        avatar
        username
      }
    }
  }
`;

const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String!, $message: String!, $toId: String!) {
    sendMessage(roomId: $roomId, message: $message, toId: $toId) {
      id
      text
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage($roomId: String!) {
    newMessage(roomId: $roomId) {
      id
      text
      from {
        id
        username
      }
    }
  }
`;

const Message = ({ navigation }) => {
  const id = navigation.getParam('roomId');
  const [me, setMe] = useState('');
  const [newMessages, setNewMessages] = useState([]);
  const sendMessageInput = useInput('');
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);

  const { data: messageData } = useSubscription(NEW_MESSAGE, {
    variables: { roomId: id }
  });
  const { data: meData } = useQuery(ME);
  const { data, loading } = useQuery(SEE_ROOM, {
    variables: { id },
    fetchPolicy: 'network-only'
  });

  const { data: oldMessage, loading: oldMessageLoading } = useQuery(MESSAGES, {
    variables: { id },
    fetchPolicy: 'network-only'
  });

  const sendMessage = async () => {
    const { value: message, setValue } = sendMessageInput;

    if (message.trim() === '') {
      return Alert.alert('메시지를 입력해주세요.');
    }

    const {
      seeRoom: { participants }
    } = data;

    const [, toId] = participants.map(value => {
      if (value.id !== me) {
        return value.id;
      }
    });

    await sendMessageMutation({
      variables: {
        roomId: id,
        message,
        toId
      }
    });

    setValue('');
  };

  const handleNewMessage = () => {
    if (messageData !== undefined) {
      const { newMessage } = messageData;
      setNewMessages([...newMessages, newMessage]);
    }
  };

  useEffect(() => {
    setMe(meData.me.id);
  }, []);

  useEffect(() => {
    handleNewMessage();
  }, [messageData]);

  useEffect(() => {
    if (oldMessage && oldMessage.messages) {
      setNewMessages(oldMessage.messages);
    }
  }, [oldMessage]);

  return (
    <View>
      {loading || oldMessageLoading ? (
        <Loader />
      ) : (
        data &&
        data.seeRoom && (
          <MessageContainer>
            <MessageList >
              {newMessages.length > 0 ? (
                newMessages.map(message => (
                  <MessageColumn align={message.from.id === me ? 'right' : ''}>
                    {message.from.id !== me && (
                      <>
                        <Avatar source={{ uri: message.from.avatar }} />
                        <Username>{message.from.username}</Username>
                      </>
                    )}
                    <Time>{moment(message.createdAt).format('hh:mm')}</Time>
                    <Text>{message.text}</Text>
                  </MessageColumn>
                ))
              ) : (
                <Text>대화 내용이 없습니다.</Text>
              )}
            </MessageList>
            <MessageInput
              onChangeText={text => sendMessageInput.setValue(text)}
              value={sendMessageInput.value}
              onSubmitEditing={sendMessage}
              placeholder='메시지를 입력해주세요.'
            />
          </MessageContainer>
        )
      )}
    </View>
  );
};

const MessageHeader = ({ navigation }) => (
  <Header>
    <Avatar source={{ uri: navigation.getParam('avatar') }} small />
    <HeaderText>{navigation.getParam('username')}</HeaderText>
  </Header>
);

Message.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <MessageHeader navigation={navigation} />,
  headerTintColor: 'black',
});

export default Message;
