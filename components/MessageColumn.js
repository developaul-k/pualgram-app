import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

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

const Time = styled(Text)`
  margin-right: 10px;
  font-size: 11px;
  color: #aaa;
`;

const Message = ({ from, createdAt, text, me }) => {
  return (
    <MessageColumn align={from.id === me ? 'right' : ''}>
      <MessageBox>
        {from.id !== me && (
          <>
            <Avatar source={{ uri: from.avatar }} />
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
