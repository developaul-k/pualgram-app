import styled from 'styled-components';
import constants from '../../../constants';

export const MessageContainer = styled.SafeAreaView`
  flex: 1;
`;

export const MessageInputBox = styled.View`
  padding: 5px 10px;
  width: ${constants.width};
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #f1f1f1;
`;

export const MessageInput = styled.TextInput`
  padding-left: 10px;
  width: 100%;
  height: 40px;
  background-color: #fff;
  border: 1px solid #f1f1f1;
  border-radius: 20px;
`;
export const Text = styled.Text``;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const HeaderText = styled(Text)`
  font-weight: 600;
`;

export const Avatar = styled.Image`
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
