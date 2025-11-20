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
  const loadData = async (page, request) => {
    try {
      setLoading(true);

      // фільтрація по title (пошук)
      let filtered = mockNews;
      if (request) {
        filtered = filtered.filter((item) =>
          item.title.toLowerCase().includes(request.toLowerCase())
        );
      }

      // підмасив на основі пагінації
      const start = (page - 1) * PER_PAGE;
      const end = start + PER_PAGE;
      const pageData = filtered.slice(start, end);
      console.log(pageData)

      // імітація запиту
      await new Promise((resolve) => setTimeout(resolve, 300));

      return pageData;
    } finally {
      setLoading(false);
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
