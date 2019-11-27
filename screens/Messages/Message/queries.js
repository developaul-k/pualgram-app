import gql from 'graphql-tag';
import { USER_FRAGMENT } from '../../../fragments';

export const MESSAGES = gql`
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

export const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String!, $message: String!, $toId: String!) {
    sendMessage(roomId: $roomId, message: $message, toId: $toId) {
      id
      text
    }
  }
`;

export const NEW_MESSAGE = gql`
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
