import React, { useEffect, useState } from 'react';
import NewsList from '../../components/newsList/NewsList';
import { mockNews } from '../../data/mockData';

const PER_PAGE = 6;

const NewsFeed = () => {
  const [newsList, setNewsList] = useState([]);       
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchRequest, setSearchRequest] = useState('');

  // імітація запиту до "серверу"
  const loadData = async (page, search, perPage=null) => {
    let data;
    try {
      setLoading(true);

      search = search.toLowerCase()

      const response = await fetch(`http://localhost:8000/news?page=${page}&perPage=${perPage || PER_PAGE}&search=${search}`)
      data = response.json();

    } finally {
      setLoading(false);
      return data;
    }
  };

  // пошук (скидає пагінацію й завантажує першу сторінку)
  const handleSearch = (searchValue) => {
    const value = searchValue.trim();
    setSearchRequest(value);
    setPage(1);
    setLastPage(false);

    loadData(1, value).then((result) => {
      setNewsList(result);
      if (result.length === 0) {
        setLastPage(true);
      }
    });
  };

  // догрузка новин при скролі донизу
  const handleLoadMore = () => {
    if (loading || lastPage) return;

    const nextPage = page + 1;

    loadData(nextPage, searchRequest).then((result) => {
      if (result.length === 0) {
        setLastPage(true);
        return;
      }

      setNewsList((prev) => [...prev, ...result]);
      setPage(nextPage);
    });
  };

  // перше завантаження
  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <NewsList
      title="📰 Останні новини"
      filteredNews={newsList}
      loading={loading}
      onSearch={handleSearch}
      onLoadMore={handleLoadMore}  
      hasMore={!lastPage}
    />
  );
};

export default NewsFeed;
