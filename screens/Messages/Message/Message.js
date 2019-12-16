import React, { useEffect, useState } from 'react';
import { FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { Ionicons } from '@expo/vector-icons';
import {
  MessageInputBox,
  MessageInput,
  MessageButton,
  Header,
  HeaderText
} from './styles';

import MessageColumn from '../../../components/MessageColumn';
import Avatar from '../../../components/Avatar';
import EmptyList from '../../../components/EmptyList';
import useInput from '../../../hooks/useInput';
import { MESSAGES, ME, SEND_MESSAGE, NEW_MESSAGE } from './queries';

const Message = ({ navigation }) => {
  const id = navigation.getParam('roomId');
  const { id: toId } = navigation.getParam('toUserInfo');
  const messagesParam = navigation.getParam('messages');

  const [me, setMe] = useState('');
  const [newMessages, setNewMessages] = useState(messagesParam);
  const [randomId, setRandomId] = useState('');
  const sendMessageInput = useInput('');

  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const { data: messageData } = useSubscription(NEW_MESSAGE, {
    variables: { roomId: id }
  });
  const { data: meData } = useQuery(ME);
  const { data, fetchMore } = useQuery(MESSAGES, {
    variables: { id, skip: 10 },
    fetchPolicy: 'network-only'
  });

  /**
   * 메시지 보내기
   */
  const sendMessage = async () => {
    const { value: message, setValue } = sendMessageInput;

    if (message.trim() === '') {
      return Alert.alert('메시지를 입력해주세요.');
    }

    setValue('');

    const rId = `${new Date().getTime()}__${Math.random(100)}`;
    await setRandomId(rId);

    await setNewMessages([
      {
        id: rId,
        text: message,
        createdAt: new Date(),
        from: { id: 'me', username: 'me' },
        to: { id: toId, username: 'pual' }
      },
      ...newMessages
    ]);

    await sendMessageMutation({
      variables: {
        roomId: id,
        message,
        toId
      }
    });
  };

  /**
   * 새로운 메시지 추가
   */
  const handleNewMessage = async () => {
    if (messageData !== undefined) {
      const { newMessage } = messageData;

      const isMessage = newMessages.filter(message => message.id === randomId);

      if (isMessage.length > 0) {
        const newM = newMessages.map(message => {
          if (message.id === randomId) {
            message = newMessage;
          }
          return message;
        });

        setNewMessages([...newM]);

        return;
      }

      setNewMessages([newMessage, ...newMessages]);
    }
  };

  useEffect(() => {
    meData && meData.me && setMe(meData.me.id);
  }, []);

  useEffect(
    () => {
      handleNewMessage();
    },
    [messageData]
  );

  /* useEffect(
    () => {
      if (data && data.messages)
        setNewMessages([
          ...newMessages,
          ...Array.from(data.messages).reverse()
        ]);
    },
    [data]
  ); */

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={90}
      style={{ flex: 1 }}
    >
      <FlatList
        data={newMessages}
        renderItem={({ item }) => <MessageColumn {...item} me={me} />}
        ListEmptyComponent={() => <EmptyList caption="대화 내용이 없습니다." />}
        keyExtractor={item => item.id}
        inverted={true}
        extraData={newMessages}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchMore({
            variables: { skip: newMessages.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.messages.length === 0) {
                return previousResult;
              }

              setNewMessages([
                ...newMessages,
                ...Array.from(fetchMoreResult.messages).reverse()
              ]);

              return {
                // Append the new messages results to the old one
                messages: previousResult.messages.concat(
                  fetchMoreResult.messages
                )
              };
            }
          });
        }}
      />
      <MessageInputBox>
        <MessageInput
          onChangeText={text => sendMessageInput.setValue(text)}
          value={sendMessageInput.value}
          autoCorrect={false}
          multiline={true}
          placeholder="메시지를 입력해주세요."
        />
        <MessageButton onPress={sendMessage}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-paper-plane' : 'md-paper-plane'}
            color="#5d90fc"
            size={23}
          />
        </MessageButton>
      </MessageInputBox>
    </KeyboardAvoidingView>
  );
};

const MessageHeader = ({ navigation }) => {
  const { avatar, username } = navigation.getParam('toUserInfo');
  return (
    <Header>
      <Avatar uri={avatar} small={true} />
      <HeaderText>
        {username}
      </HeaderText>
    </Header>
  );
};

Message.navigationOptions = ({ navigation }) => ({
  headerTitle: () => <MessageHeader navigation={navigation} />,
  headerTintColor: 'black'
});

export default Message;
