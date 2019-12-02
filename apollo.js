import constants from './constants';

const httpApolloClientOptions = {
  uri: constants.devServer
};

const wsApolloClientOptions = {
  uri: constants.devServer
};

export { httpApolloClientOptions, wsApolloClientOptions };
