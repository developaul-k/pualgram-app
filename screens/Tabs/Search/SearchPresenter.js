import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Loader from '../../../components/Loader';
import SquarePhoto from '../../../components/SquarePhoto';

const View = styled.View``;

const SEARCH = gql`
  query search($term: String!) {
    searchPost(term: $term) {
      files {
        id
        url
      }
      likeCount
      commentCount
      id
    }
    searchUser(term: $term) {
      avatar
      username
      isFollowing
      isSelf
      id
    }
  }
`;

const SearchPresenter = ({ term, shouldFetch }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(SEARCH, {
    variables: {
      term
    },
    skip: !shouldFetch,
    fetchPolicy: 'network-only'
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      refetch({ variables: { term } });
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          {data &&
            data.searchPost &&
            data.searchPost.map(post => (
              <SquarePhoto key={post.id} {...post} />
            ))}
        </View>
      )}
    </ScrollView>
  );
};

SearchPresenter.propTypes = {
  term: PropTypes.string.isRequired,
  shouldFetch: PropTypes.bool.isRequired
};

export default SearchPresenter;
