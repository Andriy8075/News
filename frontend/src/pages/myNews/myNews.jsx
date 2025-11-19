import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../../components/newsCard/newsCard';
import SearchBar from '../../components/searchBar/searchBar';
import ConfirmModal from '../../components/confirmModel/confirmModal';
import '../newsFeed/newsFeed.scss';
import { GETFetch } from '../../hooks/GETFetch';
import { getCsrfTokenFromCookie } from '../../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await GETFetch('/mynews');
        console.log('News data', data);
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

  const handleDeleteClick = (id) => {
    setSelectedNewsId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = getCsrfTokenFromCookie();
    const response = await fetch(`${API_BASE_URL}/news/${selectedNewsId}/delete`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': token,
      },
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      console.log('data', data);
    } else {
      console.error('Failed to delete news', response.status);
    }

    const updatedNews = news.filter(item => item.id !== selectedNewsId);
    setNews(updatedNews);
    setFilteredNews(updatedNews);
    setIsModalOpen(false);
    setSelectedNewsId(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedNewsId(null);
  };

  const handleEdit = (id) => {
    navigate(`/news/${id}/edit`);
  };

  return (
    <div className="news-feed">
      <div className="container">
        <h1 className="page-title">📰 Мої новини</h1>

        <SearchBar onSearch={handleSearch} />

        <div className="news-grid">
          {filteredNews.map(item => (
            <NewsCard
              key={item.id}
              news={item}
              onDelete={handleDeleteClick}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="no-results">
            <h3>😔 Нічого не знайдено</h3>
            <p>Спробуйте змінити пошуковий запит</p>
          </div>
        )}

        <ConfirmModal
          isOpen={isModalOpen}
          title="Підтвердження видалення"
          message="Ви дійсно хочете видалити цю новину?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default MyNews;
