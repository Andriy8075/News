import React from 'react';
import { useNewsList } from '../../hooks/useNewsList';
import NewsList from '../../components/newsList/NewsList';

const NewsFeed = () => {
  const { filteredNews, loading, handleSearch } = useNewsList('/news');

  return (
    <NewsList
      title="📰 Останні новини"
      filteredNews={filteredNews}
      loading={loading}
      onSearch={handleSearch}
    />
  );
};

export default NewsFeed;                            