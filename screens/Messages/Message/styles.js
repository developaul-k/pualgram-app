import styled from 'styled-components';
import constants from '../../../constants';

export const MessageContainer = styled.SafeAreaView`flex: 1;`;

export const MessageInputBox = styled.View`
  padding: 5px 10px;
  width: ${constants.width};
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #f1f1f1;
`;

export const MessageButton = styled.TouchableOpacity`
  position: absolute;
  top: 50%;
  margin-top: -7px;
  right: 25px;
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