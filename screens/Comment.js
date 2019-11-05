import React, { useState, useEffect } from 'react';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Loader from '../components/Loader';
import styled from 'styled-components';
import useInput from '../hooks/useInput';

const Container = styled.View`
  flex: 1;
`;
const CommentInput = styled.TextInput`
  height: 50px;
  border: 1px solid ${props => props.theme.lightGreyColor};
  background-color: 'blue';
`;
const Text = styled.Text``;

export default ({ navigation }) => {
  const comment = useInput('');

  return (
    <KeyboardAvoidingView
      behavior='position'
      enabled
      keyboardVerticalOffset={100}
      contentContainerStyle={{ height: '100%' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Text>댓글</Text>
        </Container>
      </TouchableWithoutFeedback>
      <CommentInput
        onChangeText={comment.onChange}
        value={comment.value}
        multiline={true}
      />
    </KeyboardAvoidingView>
  );
};
