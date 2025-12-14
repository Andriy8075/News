import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsFeed from '../newsFeed/newsFeed';
import ConfirmModal from '../../components/confirmModel/confirmModal';
import { deleteNews } from '../../utils/deleteNews';

const MyNews = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDeleteClick = (id) => {
    setSelectedNewsId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNews(selectedNewsId);
      setRefreshKey((prev) => prev + 1);
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
      <NewsFeed
        key={refreshKey}       
        type="created"
        title="📰 My news"
        enableActions={true}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm deletion"
        message="Do you really want to delete this news?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default MyNews;
