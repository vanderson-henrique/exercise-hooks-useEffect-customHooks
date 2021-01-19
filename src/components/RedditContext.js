import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getPostsBySubreddit } from '../services/redditAPI';

const Context = createContext();
const { Provider, Consumer } = Context;
/* constructor(props) {
    super(props);

    this.state = {
      postsBySubreddit: {
        frontend: {},
        reactjs: {},
      },
      selectedSubreddit: 'reactjs',
      shouldRefreshSubreddit: false,
      isFetching: false,
    };

    this.fetchPosts = this.fetchPosts.bind(this);
    this.shouldFetchPosts = this.shouldFetchPosts.bind(this);
    this.handleFetchSuccess = this.handleFetchSuccess.bind(this);
    this.handleFetchError = this.handleFetchError.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
    this.handleRefreshSubreddit = this.handleRefreshSubreddit.bind(this);
  } */
function RedditProvider({ children }) {
  const [postsBySubreddit, setPostsBySubreddit] = useState({ frontend: {}, reactjs: {} });
  const [selectedSubreddit, setsSlectedSubreddit] = useState('reactjs');
  const [shouldRefreshSubreddit, setShouldRefreshSubreddit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  console.log('postsBySubreddit', postsBySubreddit);
  console.log('selectedSubreddit', selectedSubreddit);
  console.log('shouldRefreshSubreddit', shouldRefreshSubreddit);
  console.log('isFetching', isFetching);
  
  useEffect(() => {
    if (shouldRefreshSubreddit) {
      fetchPosts();
    }
  });


  /* componentDidUpdate(_prevProps, prevState) {
    const { state } = this;
    const { shouldRefreshSubreddit } = state;
    const selectedSubredditChanged = prevState.selectedSubreddit !== state.selectedSubreddit;

    if (selectedSubredditChanged || shouldRefreshSubreddit) {
      this.fetchPosts();
    }
  } */

  const fetchPosts = () => {
    if (!shouldFetchPosts()) return;

    setShouldRefreshSubreddit(false);
    setIsFetching(true);

    /* this.setState({
      shouldRefreshSubreddit: false,
      isFetching: true,
    }); */

    // const { selectedSubreddit } = this.state;
    getPostsBySubreddit(selectedSubreddit)
      .then(handleFetchSuccess, handleFetchError);
  }

  const shouldFetchPosts = () => {
    /* const {
      selectedSubreddit,
      postsBySubreddit,
      shouldRefreshSubreddit,
      isFetching,
    } = this.state; */
    const posts = postsBySubreddit[selectedSubreddit];

    if (!posts.items) return true;
    if (isFetching) return false;
    return shouldRefreshSubreddit;
  }

  const handleFetchSuccess = (json) => {
    const lastUpdated = Date.now();
    const items = json.data.children.map((child) => child.data);

    /* const newState = {
      postsBySubreddit,
      selectedSubreddit,
      shouldRefreshSubreddit: false,
      isFetching: false,
      { frontend: {}, reactjs: {} }
    } */

    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit({...postsBySubreddit ,[selectedSubreddit]: { items, lastUpdated }})

    /* this.setState((state) => {
      const newState = {
        ...state,
        shouldRefreshSubreddit: false,
        isFetching: false,
      }; */

      /* newState.postsBySubreddit[newState.selectedSubreddit] = {
        items,
        lastUpdated,
      }; 

      return newState;*/

  }

  const handleFetchError = (error) => {

    setShouldRefreshSubreddit(false);
    setIsFetching(false);
    setPostsBySubreddit({...postsBySubreddit ,[selectedSubreddit]: { items: [], error: error.message }})
  }

  const handleSubredditChange = (selectedSubreddit) => {
    setsSlectedSubreddit(selectedSubreddit);
  }

  const handleRefreshSubreddit = () => {
    setShouldRefreshSubreddit(true);
  }

    const context = {
      postsBySubreddit,
      selectedSubreddit,
      shouldRefreshSubreddit,
      isFetching,
      selectSubreddit: handleSubredditChange,
      fetchPosts: fetchPosts,
      refreshSubreddit: handleRefreshSubreddit,
      availableSubreddits: Object.keys(postsBySubreddit),
      posts: postsBySubreddit[selectedSubreddit].items,
    };

    return (
      <Provider value={context}>
        {children}
      </Provider>
    );
}

RedditProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { RedditProvider as Provider, Consumer, Context };