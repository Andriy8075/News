import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewsList } from '../../hooks/useNewsList';
import { deleteNews } from '../../utils/deleteNews';
import NewsList from '../../components/newsList/NewsList';
import ConfirmModal from '../../components/confirmModel/confirmModal';

const MyNews = () => {
  const navigate = useNavigate();
  const { news, filteredNews, loading, handleSearch, updateNews } = useNewsList('/mynews');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedNewsId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNews(selectedNewsId);
      const updatedNews = news.filter(item => item.id !== selectedNewsId);
      updateNews(updatedNews);
    } catch (error) {
      console.error('Failed to delete news', error);
    } finally {
      setIsModalOpen(false);
      setSelectedNewsId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedNewsId(null);
  };

  const handleEdit = (id) => {
    navigate(`/news/${id}/edit`);
  };

  return (
    <>
      <NewsList
        title="📰 Мої новини"
        filteredNews={filteredNews}
        loading={loading}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={isModalOpen}
        title="Підтвердження видалення"
        message="Ви дійсно хочете видалити цю новину?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default MyNews;
