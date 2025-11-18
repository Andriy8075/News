import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../../components/newsCard/newsCard';
import SearchBar from '../../components/searchBar/searchBar';
import ConfirmModal from '../../components/confirmModel/confirmModal';
import { mockNews } from '../../data/mockData';
import '../newsFeed/newsFeed.scss';

const MyNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const navigate = useNavigate();

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

  const handleDeleteClick = (id) => {
    setSelectedNewsId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
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
