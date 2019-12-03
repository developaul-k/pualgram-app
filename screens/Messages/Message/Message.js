import React, { useEffect, useState } from 'react';
import { FlatList, Alert, KeyboardAvoidingView } from 'react-native';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import {
  MessageContainer,
  MessageInputBox,
  MessageInput,
  Text,
  Header,
  HeaderText
} from './styles';

import MessageColumn from '../../../components/MessageColumn';
import Avatar from '../../../components/Avatar';
import useInput from '../../../hooks/useInput';
import { MESSAGES, ME, SEND_MESSAGE, NEW_MESSAGE } from './queries';

const Message = ({ navigation }) => {
  const id = navigation.getParam('roomId');
  const { id: toId } = navigation.getParam('toUserInfo');
  const messagesParam = navigation.getParam('messages');

  const [me, setMe] = useState('');
  const [newMessages, setNewMessages] = useState(
    Array.from(messagesParam).reverse()
  );
  const sendMessageInput = useInput('');

  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const { data: messageData } = useSubscription(NEW_MESSAGE, {
    variables: { roomId: id }
  });
  const { data: meData } = useQuery(ME);
  const { data } = useQuery(MESSAGES, {
    variables: { id },
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

  useEffect(
    () => {
      if (data && data.messages) setNewMessages(data.messages.reverse());
    },
    [data]
  );

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
          ListEmptyComponent={() => <Text>대화 내용이 없습니다.</Text>}
          keyExtractor={(item) => item.id}
          inverted={true}
          extraData={newMessages}
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
      <Avatar uri={avatar} />
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
