import React from 'react';
import { Link } from 'react-router-dom';
import './newsCard.scss';

const NewsCard = ({ news, onEdit, onDelete }) => {
  console.log(news)
  return (
    <div className="news-card">
      <Link to={`/news/${news.id}`} className="news-card-link">
        <div className="news-image-container">
          {news.image ? (
            <img 
              src={news.image} 
              alt={news.title}
              className="news-image"
            />
          ) : (
            <div className="news-image news-image--placeholder">
              📰
            </div>
          )}
          <div className="news-category">{news.category}</div>
        </div>
        
        <div className="news-content">
          <h3 className="news-title">{news.title}</h3>
          <p className="news-excerpt">{news.excerpt}</p>
          
          <div className="news-meta">
            <span className="news-author">👤 {news.author}</span>
            <span className="news-date">
              📅 {new Date(news.date).toLocaleDateString('en-US')}
            </span>
          </div>
          
          <div className="news-stats">
            <span className="news-views">👁️ {news.views}</span>
            <span className="news-likes">❤️ {news.likes}</span>
          </div>

          {(onEdit || onDelete) && (
            <div className="news-actions">
              {onEdit && (
                <button className="edit-btn" onClick={(e) => { e.preventDefault(); onEdit(news.id); }}>
                  ✏️ Edit
                </button>
              )}
              {onDelete && (
                <button className="delete-btn" onClick={(e) => { e.preventDefault(); onDelete(news.id); }}>
                  🗑️ Delete
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
