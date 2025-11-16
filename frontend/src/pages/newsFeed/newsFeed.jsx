import React, { useState, useEffect } from 'react';
import NewsCard from '../../components/newsCard/newsCard';
import SearchBar from '../../components/searchBar/searchBar';
import { mockNews } from '../../data/mockData';
import './newsFeed.scss';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);

  useEffect(() => {
    // Імітація завантаження даних
    setNews(mockNews);
    setFilteredNews(mockNews);
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredNews(news);
      return;
    }

    const filtered = news.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNews(filtered);
  };

  return (
    <div className="news-feed">
      <div className="container">
        <h1 className="page-title">📰 Останні новини</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        <div className="news-grid">
          {filteredNews.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
        
        {filteredNews.length === 0 && (
          <div className="no-results">
            <h3>😔 Нічого не знайдено</h3>
            <p>Спробуйте змінити пошуковий запит</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;                            