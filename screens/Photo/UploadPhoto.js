import React, { useState, useEffect } from 'react';
import { Image, Alert, ActivityIndicator } from 'react-native';
import useInput from '../../hooks/useInput';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import styles from '../../styles';
import constants from '../../constants';
import { useMutation } from '@apollo/react-hooks';
import { FEED_QUERY } from '../Tabs/Home';

const UPLOAD = gql`
  mutation upload($caption: String!, $files: [String!]!, $location: String) {
    upload(caption: $caption, files: $files, location: $location) {
      id
      location
      caption
    }
  }
`;

const View = styled.View`
  padding: 20px;
  flex: 1;
  flex-direction: row;
`;
const Text = styled.Text`
  color: white;
  font-weight: 600;
`;
const Column = styled.View`width: 100px;`;
const InputColumn = styled(Column)`
  margin-left: 15px;
  width: ${constants.width - 155};
`;
const Form = styled.View``;
const TextInput = styled.TextInput`
  margin-bottom: 10px;
  padding: 10px 0;
  width: 100%;
  border: 1px solid ${styles.lightGreyColor};
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;
  background-color: #fff;
`;
const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

export default ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const photo = navigation.getParam('photo');
  const captionInput = useInput('');
  const locationInput = useInput('');

  const [uploadMutation] = useMutation(UPLOAD, {
    refetchQueries: () => [{ query: FEED_QUERY }]
  });

  const handleSubmit = async () => {
    if (captionInput.value === '' || locationInput.value == '')
      Alert.alert('All fields are required');

    const formData = new FormData();
    const name = photo.filename;
    const [, type] = name.split('.');

    formData.append('file', {
      name: photo.filename,
      type: `image/${type.toLowerCase()}`,
      uri: photo.uri
    });

    try {
      setLoading(true);

      const response = await fetch(`${constants.devServer}/api/upload`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      const { location } = await response.json();

      setFileUrl(location);

      const { data: { upload } } = await uploadMutation({
        variables: {
          caption: captionInput.value,
          files: [location],
          location: locationInput.value
        }
      });

      if (upload.id) {
        navigation.navigate('TabNavigation');
      }
    } catch (err) {
      Alert.alert('Cant upload try again');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);
  return (
    <View>
      <Column>
        <Image
          source={{ uri: photo.uri }}
          style={{ width: 100, height: 100 }}
        />
      </Column>
      <InputColumn>
        <Form>
          <TextInput
            placeholder="Caption"
            onChangeText={captionInput.onChange}
            value={captionInput.value}
            multiline={true}
          />
          <TextInput
            placeholder="Location"
            onChangeText={locationInput.onChange}
            value={locationInput.value}
          />
          <Button onPress={handleSubmit}>
            {loading
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text>Upload</Text>}
          </Button>
        </Form>
      </InputColumn>
    </View>
  );
};
