import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { AsyncStorage } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-client';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from '@apollo/react-hooks';
import { AuthProvider } from './AuthContext';
import NavControllers from './components/NavControllers';
import styles from './styles';

import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { setContext } from 'apollo-link-context';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const preLoad = async () => {
    try {
      // Font
      await Font.loadAsync({
        ...Ionicons.font
      });

      const cache = new InMemoryCache();

      await Asset.loadAsync([
        require('./assets/splash_wally.png'),
        require('./assets/logo.png')
      ]);

      await persistCache({
        cache,
        storage: AsyncStorage
      });

      const httpLink = new HttpLink({
        uri: 'http://localhost:4000',
        credentials: 'same-origin'
      });

      const wsLink = new WebSocketLink({
        uri: `ws://localhost:4000/`,
        options: {
          reconnect: true
        }
      });

      const authLink = setContext(async (_, { headers }) => {
        const token = await AsyncStorage.getItem('jwt');
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
          }
        };
      });

      const link = ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.forEach(({ message, locations, path }) => {
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              );
            });
          if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          wsLink,
          authLink.concat(httpLink)
        )
      ]);

      const client = new ApolloClient({
        link,
        cache
        /* request: async operation => {
          const token = await AsyncStorage.getItem('jwt');

          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` }
          });
        } */
      });

      /* const client = new ApolloClient({
        cache,
        request: async operation => {
          const token = await AsyncStorage.getItem('jwt');
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` }
          });
        },
        ...apolloClientOptions
      }); */

      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      if (isLoggedIn === null || isLoggedIn === 'false') {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
      setLoaded(true);
      setClient(client);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);

  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <AuthProvider isLoggedIn={isLoggedIn}>
          <NavControllers />
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
