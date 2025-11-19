import React from 'react';
import NewsCard from '../newsCard/newsCard';
import SearchBar from '../searchBar/searchBar';
import './newsList.scss';

const NewsList = ({
  title,
  filteredNews,
  loading,
  onSearch,
  onEdit,
  onDelete,
  emptyMessage = 'Нічого не знайдено',
  emptySubMessage = 'Спробуйте змінити пошуковий запит',
}) => {
  return (
    <div className="news-feed">
      <div className="container">
        <h1 className="page-title">{title}</h1>
        
        <SearchBar onSearch={onSearch} />
        
        {loading && (
          <div className="loading">
            <p>Завантаження новин...</p>
          </div>
        )}
        
        {!loading && (
          <>
            <div className="news-grid">
              {filteredNews.map(item => (
                <NewsCard
                  key={item.id}
                  news={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
            
            {filteredNews.length === 0 && (
              <div className="no-results">
                <h3>😔 {emptyMessage}</h3>
                <p>{emptySubMessage}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsList;

