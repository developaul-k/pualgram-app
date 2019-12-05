import React, { useEffect, useState } from 'react';
import { FlatList, Alert, KeyboardAvoidingView } from 'react-native';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import {
  MessageContainer,
  MessageInputBox,
  MessageInput,
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

    await sendMessageMutation({
      variables: {
        roomId: id,
        message,
        toId
      }
    });

    setValue('');
  };

  /**
   * 새로운 메시지 추가
   */
  const handleNewMessage = async () => {
    if (messageData !== undefined) {
      const { newMessage } = messageData;
      await setNewMessages([newMessage, ...newMessages]);
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
    <MessageContainer>
      <KeyboardAvoidingView
        behavior="position"
        enabled
        keyboardVerticalOffset={90}
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
          style={{ marginBottom: 50 }}
        />
      </KeyboardAvoidingView>
      <KeyboardAvoidingView
        behavior="position"
        enabled
        keyboardVerticalOffset={88}
        contentContainerStyle={{
          position: 'absolute',
          bottom: 0,
          justifyContent: 'flex-end'
        }}
      >
        <MessageInputBox>
          <MessageInput
            onChangeText={text => sendMessageInput.setValue(text)}
            value={sendMessageInput.value}
            onSubmitEditing={sendMessage}
            autoCorrect={false}
            placeholder="메시지를 입력해주세요."
          />
        </MessageInputBox>
      </KeyboardAvoidingView>
    </MessageContainer>
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
