import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/SearchBar';
import SearchPresenter from './SearchPresenter';
import { withNavigation } from 'react-navigation';

const SearchContainer = ({ navigation }) => {
  const [term, setTerm] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const onChange = text => {
    setTerm(text);
    setShouldFetch(false);
    navigation.setParams({
      term: text
    });
  };

  const onSubmit = () => {
    setShouldFetch(true);
  };

  useEffect(() => {
    navigation.setParams({
      term,
      onChange,
      onSubmit
    });
  }, []);

  return <SearchPresenter term={term} shouldFetch={shouldFetch} />;
};

SearchContainer.navigationOptions = ({ navigation }) => ({
  headerTitle: (
    <SearchBar
      value={navigation.getParam('term', '')}
      onChange={navigation.getParam('onChange', () => null)}
      onSubmit={navigation.getParam('onSubmit', () => null)}
    />
  )
});

export default withNavigation(SearchContainer);

/*
클래스 컴포넌트로 작업 했을 경우 니콜라스 버전
export default class extends React.Component {

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      term: '',
      shouldFetch: false
    };
    navigation.setParams({
      term: this.state.term,
      onChange: this.onChange,
      onSubmit: this.onSubmit
    });
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <SearchBar
        value={navigation.getParam('term', '')}
        onChange={navigation.getParam('onChange', () => null)}
        onSubmit={navigation.getParam('onSubmit', () => null)}
      />
    )
  });
  onChange = text => {
    const { navigation } = this.props;
    this.setState({ term: text, shouldFetch: false });
    navigation.setParams({
      term: text
    });
  };
  onSubmit = () => {
    this.setState({ shouldFetch: true });
  };
  render() {
    const { term, shouldFetch } = this.state;
    return <SearchPresenter term={term} shouldFetch={shouldFetch} />;
  }
} */
