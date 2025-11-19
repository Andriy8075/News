import { useState, useEffect } from 'react';
import { GETFetch } from './GETFetch';

/**
 * Custom hook for managing news list with search functionality
 * @param {string} endpoint - API endpoint to fetch news from
 * @returns {Object} News list state and handlers
 */
export const useNewsList = (newsType) => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await GETFetch('/news?type=' + newsType);
        setNews(data);
        setFilteredNews(data);
      } catch (err) {
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

  const updateNews = (updatedNews) => {
    setNews(updatedNews);
    setFilteredNews(updatedNews);
  };

  return {
    news,
    filteredNews,
    loading,
    handleSearch,
    updateNews,
    setNews,
    setFilteredNews,
  };
};

