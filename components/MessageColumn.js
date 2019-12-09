import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Avatar from './Avatar';

const MessageColumn = styled.View`
  margin: 5px;
  align-items: flex-start;
  ${props =>
    props.align === 'right' &&
    `
    align-items: flex-end;
  `}
`;

const MessageBox = styled.View`
  padding: 10px;
  max-width: 50%;
  border-radius: 10px;
  background-color: #f1f1f1;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const Text = styled.Text``;

const Username = styled(Text)`
  padding: 0 10px;
`;

const Time = styled(Text)`
  margin-right: 10px;
  font-size: 11px;
  color: #aaa;
`;

const Message = ({ from, createdAt, text, me }) => {
  return (
    <MessageColumn align={from.id === me || from.id === 'me' ? 'right' : ''}>
      <MessageBox>
        {from.id !== me && from.id !== 'me' && (
          <>
            <Avatar uri={from.avatar} />
            <Username>{from.username}</Username>
          </>
        )}
        <Time>{moment(createdAt).format('hh:mm')}</Time>
        <Text>{text}</Text>
      </MessageBox>
    </MessageColumn>
  );
};

export default Message;
