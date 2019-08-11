import React from 'react';
import styled from 'styled-components';
import constants from '../../constants';
import AuthButton from '../../components/AuthButton';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Image = styled.Image`
  width: ${constants.width / 3.5};
`;
const Touchable = styled.TouchableOpacity``;
const LoginLink = styled.View``;
const LoginLinkText = styled.Text`
  margin-top: 20px;
  font-weight: 600;
  color: ${props => props.theme.blueColor};
`;

export default ({ navigation }) => (
  <View>
    <Image resizeMode={'contain'} source={require('../../assets/icon.png')} />
    <AuthButton
      text={'Create New Account'}
      onPress={() => navigation.navigate('Signup')}
    />
    <Touchable onPress={() => navigation.navigate('Login')}>
      <LoginLink>
        <LoginLinkText>Log in</LoginLinkText>
      </LoginLink>
    </Touchable>
  </View>
);
