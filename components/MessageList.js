import React, { useState } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const View = styled.View`
  padding: 10px;
`;
const Touchable = styled.TouchableOpacity``;
const Column = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: ${props => props.greyColor};
`;
const Text = styled.Text`
  margin-left: 10px;
`;

const MessageList = withNavigation(
  ({ navigation, id, participants, messages }) => {
    const [roomId] = useState(id);
    const [, toUser] = participants;

    return (
      <View>
        <Touchable
          onPress={() =>
            navigation.navigate('Message', {
              roomId,
              toUserInfo: toUser,
              messages
            })
          }
        >
          <Column>
            <Avatar source={{ uri: toUser.avatar }} />
            <Text>{toUser.username}</Text>
          </Column>
        </Touchable>
      </View>
    );
  }
);

export default MessageList;
