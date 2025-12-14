import React, { useEffect, useRef, useCallback } from 'react';
import NewsCard from '../newsCard/newsCard';
import SearchBar from '../searchBar/searchBar';
import './newsList.scss';

const NewsList = ({
  title,
  filteredNews,
  loading,
  onSearch,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
  emptyMessage = 'Nothing found',
  emptySubMessage = 'Try changing your search query',
}) => {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  // always update refs when props change
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const observerCallback = useCallback(
    (entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMoreRef.current && !loadingRef.current) {
        onLoadMore();
      }
    },
    [onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px 200px 0px',
      threshold: 0.1,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [observerCallback]);

  return (
    <div className="news-feed">
      <div className="container">
        <h1 className="page-title">{title}</h1>

        <SearchBar onSearch={onSearch} />

        <div className="news-grid">
          {filteredNews.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>

        {loading && (
          <div className="loading">
            <p>Loading news...</p>
          </div>
        )}

        {filteredNews.length === 0 && !loading && (
          <div className="no-results">
            <h3>😔 {emptyMessage}</h3>
            <p>{emptySubMessage}</p>
          </div>
        )}

        <div ref={sentinelRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
};

export default NewsList;
