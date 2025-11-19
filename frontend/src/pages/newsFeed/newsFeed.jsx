import React, { useState, useEffect } from 'react';
import NewsCard from '../../components/newsCard/newsCard';
import SearchBar from '../../components/searchBar/searchBar';
import './newsFeed.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/news`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNews(data);
          setFilteredNews(data);
        } else {
          setError('Не вдалося завантажити новини');
          console.error('Failed to fetch news:', response.status);
        }
      } catch (err) {
        setError('Помилка підключення до сервера');
        console.error('Error fetching news', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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
        
        {loading && (
          <div className="loading">
            <p>Завантаження новин...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;                            