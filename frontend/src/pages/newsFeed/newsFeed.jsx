import React, { useEffect, useRef, useState, useCallback } from 'react';
import NewsCard from '../../components/newsCard/newsCard';
import SearchBar from '../../components/searchBar/searchBar';
import './newsFeed.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PER_PAGE = 6;

const NewsFeed = ({
  type = 'allNews',          
  title = '📰 Latest news',
  enableActions = false,    
  onEdit,                   
  onDelete,                
}) => {
  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchRequest, setSearchRequest] = useState('');

  const sentinelRef = useRef(null);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(!lastPage);

  // update refs so IntersectionObserver sees current values
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = !lastPage;
  }, [loading, lastPage]);

  // ⚙️ server request 
  const loadData = async (pageToLoad, search, perPage = null) => {
    let data;
    search = search.toLowerCase();

    try {
      setLoading(true);

      let urlRequest = `${API_BASE_URL}/news?page=${pageToLoad}&perPage=${perPage || PER_PAGE}&search=${search}`;

      if (type !== 'allNews') {
        // for example, backend filters user-created news by type=created
        urlRequest += '&type=created';
      }

      const response = await fetch(urlRequest);
      data = await response.json();
    } finally {
      setLoading(false);
      return data;
    }
  };

  // 🔍 search 
  const handleSearch = (searchValue) => {
    const value = searchValue.trim();
    setSearchRequest(value);
    setPage(1);
    setLastPage(false);

    loadData(1, value).then((result) => {
      setNewsList(result || []);
      if (!result || result.length === 0) {
        setLastPage(true);
      }
    });
  };

  // ♾ load more news on scroll
  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;

    const nextPage = page + 1;

    loadData(nextPage, searchRequest).then((result) => {
      if (!result || result.length === 0) {
        setLastPage(true);
        return;
      }

      setNewsList((prev) => [...prev, ...result]);
      setPage(nextPage);
    });
  }, [page, searchRequest]);

  // IntersectionObserver for infinite loading
  const observerCallback = useCallback(
    (entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        handleLoadMore();
      }
    },
    [handleLoadMore]
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

  // initial load
  useEffect(() => {
    handleSearch('');
  }, [type]); 

  return (
    <div className="news-feed">
      <div className="container">
        <h1 className="page-title">{title}</h1>

        <SearchBar onSearch={handleSearch} />

        <div className="news-grid">
          {newsList.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onEdit={enableActions ? onEdit : undefined}
              onDelete={enableActions ? onDelete : undefined}
            />
          ))}
        </div>

        {loading && (
          <div className="loading">
            <p>Loading news...</p>
          </div>
        )}

        {newsList.length === 0 && !loading && (
          <div className="no-results">
            <h3>😔 Nothing found</h3>
            <p>Try changing your search query</p>
          </div>
        )}

        <div ref={sentinelRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
};

export default NewsFeed;
