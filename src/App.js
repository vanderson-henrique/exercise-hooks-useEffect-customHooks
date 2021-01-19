import React, { useContext, useEffect } from 'react';

import Posts from './components/Posts';
import Selector from './components/Selector';
import { Context } from './components/RedditContext';

function App() {
  const {
    selectedSubreddit,
    postsBySubreddit,
    isFetching,
    fetchPosts,
    refreshSubreddit} = useContext(Context);

    useEffect(() => {
      fetchPosts();
    },);

  /* componentDidMount() {
    const { fetchPosts } = this.context;
    fetchPosts();
  } */

  const renderLastUpdatedAt = () => {
    // const { selectedSubreddit, postsBySubreddit } = this.context;
    const { lastUpdated } = postsBySubreddit[selectedSubreddit];

    if (!lastUpdated) return null;

    return (
      <span>
        {`Last updated at ${new Date(lastUpdated).toLocaleTimeString()}.`}
      </span>
    );
  }

  const renderRefreshButton = () => {
    // const { isFetching, refreshSubreddit } = this.context;

    if (isFetching) return null;

    return (
      <button
        type="button"
        onClick={(event) => refreshSubreddit(event)}
        disabled={isFetching}
      >
        Refresh
      </button>
    );
  }

    // const { selectedSubreddit, postsBySubreddit, isFetching } = this.context;
    const { items: posts = [] } = postsBySubreddit[selectedSubreddit];
    const isEmpty = posts.length === 0;

    return (
      <div>
        <Selector />
        <div>
          {renderLastUpdatedAt()}
          {renderRefreshButton()}
        </div>
        {isFetching && <h2>Loading...</h2>}
        {!isFetching && isEmpty && <h2>Empty.</h2>}
        {!isFetching && !isEmpty && <Posts />}
      </div>
    );
}

// App.contextType = Context;

export default App;