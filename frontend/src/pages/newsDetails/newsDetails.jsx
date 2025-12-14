import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './newsDetails.scss';
import { GETFetch } from '../../hooks/GETFetch';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await GETFetch(`/news/${id}`);
        setNews(data);
      } catch (err) {
        console.error('Error fetching news', err);
      }
    };

    fetchNews();
  }, []);

  if (!news) {
    return (
      <div className="news-detail">
        <div className="container">
          <div className="not-found">
            <h2>Please wait, searching for news 😔</h2>
            <Link to="/" className="back-link">← Back to home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail">
      <div className="container">
        <Link to="/" className="back-link">← Back to all news</Link>
        
        <article className="news-article">
          <header className="news-header">
            <div className="news-meta">
              <span className="category">{news.category}</span>
              <span className="date">
                📅 {new Date(news.date).toLocaleDateString('en-US')}
              </span>
            </div>
            
            <h1 className="news-title">{news.title}</h1>
            
            <div className="author-info">
              <span className="author">👤 {news.author}</span>
              <div className="stats">
                <span className="views">👁️ {news.views} views</span>
                <span className="likes">❤️ {news.likes} likes</span>
              </div>
            </div>
          </header>

          <div className="news-image-full">
            <img src={news.image} alt={news.title} />
          </div>

          <div className="news-content">
            <p className="news-excerpt">{news.excerpt}</p>
            
            <div className="news-full-text">
              {news.content}
            </div>

            <div className="news-tags">
              {news.tags?.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;