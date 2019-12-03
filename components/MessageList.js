import React, { useState } from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from './Avatar';

const View = styled.View`padding: 10px;`;
const Touchable = styled.TouchableOpacity``;
const Column = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Text = styled.Text`margin-left: 10px;`;

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
            })}
        >
          <Column>
            <Avatar uri={toUser.avatar} />
            <Text>
              {toUser.username}
            </Text>
          </Column>
        </Touchable>
      </View>
    );
  }
);

export default MessageList;
