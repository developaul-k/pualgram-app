import React, { useState } from 'react';
import * as Facebook from 'expo-facebook';
import { Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styled from 'styled-components';
import AuthButton from '../../components/AuthButton';
import AuthInput from '../../components/AuthInput';
import useInput from '../../hooks/useInput';
import { useMutation } from 'react-apollo-hooks';
import { CREATE_ACCOUNT } from './AuthQueries';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const FBContainer = styled.View`
  margin-top: 25px;
  padding-top: 25px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.lightGreyColor};
`;

export default ({ navigation }) => {
  const fNameInput = useInput('');
  const lNameInput = useInput('');
  const usernameInput = useInput('');
  const emailInput = useInput(navigation.getParam('email', ''));
  const [loading, setLoading] = useState(false);
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
    variables: {
      username: usernameInput.value,
      email: emailInput.value,
      firstName: fNameInput.value,
      lastName: lNameInput.value
    }
  });

  // Sign up
  const handleSignup = async () => {
    const { value: email } = emailInput;
    const { value: fName } = fNameInput;
    const { value: username } = usernameInput;

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
      return Alert.alert('That email is invalid');
    }

    if (fName === '') {
      return Alert.alert('I need your name');
    }

    if (username === '') {
      return Alert.alert('Invalid username');
    }

    try {
      setLoading(true);

      const {
        data: { createAccount }
      } = await createAccountMutation();

      if (createAccount) {
        Alert.alert('Account created', 'Log in now!');
        navigation.navigate('Login', { email });
      }
    } catch (e) {
      console.log(e);
      Alert.alert(`Username taken.`, 'Log in instead');
      navigation.navigate('Login', { email });
    } finally {
      setLoading(false);
    }
  };

  // Login facebook
  const fbLogin = async () => {
    try {
      setLoading(true);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        '1530568087095841',
        { permissions: ['public_profile', 'email'] }
      );

      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,last_name,first_name,email`
        );
        const { email, first_name, last_name } = await response.json();
        const [username] = email.split('@');

        emailInput.setValue(email);
        fNameInput.setValue(first_name);
        lNameInput.setValue(last_name);
        usernameInput.setValue(username);
        setLoading(false);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...fNameInput}
          placeholder='First Name'
          autoCapitalize='words'
          onSubmitEditing={handleSignup}
        />
        <AuthInput
          {...lNameInput}
          placeholder='Last Name'
          autoCapitalize='words'
          onSubmitEditing={handleSignup}
        />
        <AuthInput
          {...emailInput}
          placeholder='Email'
          keyboardType='email-address'
          onSubmitEditing={handleSignup}
          autoCorrect={false}
        />
        <AuthInput
          {...usernameInput}
          placeholder='Username'
          returnKeyType='send'
          onSubmitEditing={handleSignup}
          autoCorrect={false}
        />
        <AuthButton loading={loading} onPress={handleSignup} text='Sign up' />
        <FBContainer>
          <AuthButton
            bgColor='#2d4da7'
            loading={false}
            onPress={fbLogin}
            loading={loading}
            text='Connect Facebook'
          />
        </FBContainer>
      </View>
    </TouchableWithoutFeedback>
  );
};
