import React, { useState } from 'react';
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
      </View>
    </TouchableWithoutFeedback>
  );
};
