import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockNews } from '../../data/mockData';
import './newsDetails.scss';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const foundNews = mockNews.find(item => item.id === parseInt(id));
    setNews(foundNews);
  }, [id]);

  if (!news) {
    return (
      <div className="news-detail">
        <div className="container">
          <div className="not-found">
            <h2>Новину не знайдено 😔</h2>
            <Link to="/" className="back-link">← Повернутися на головну</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail">
      <div className="container">
        <Link to="/" className="back-link">← Повернутися до всіх новин</Link>
        
        <article className="news-article">
          <header className="news-header">
            <div className="news-meta">
              <span className="category">{news.category}</span>
              <span className="date">
                📅 {new Date(news.date).toLocaleDateString('uk-UA')}
              </span>
            </div>
            
            <h1 className="news-title">{news.title}</h1>
            
            <div className="author-info">
              <span className="author">👤 {news.author}</span>
              <div className="stats">
                <span className="views">👁️ {news.views} переглядів</span>
                <span className="likes">❤️ {news.likes} вподобайок</span>
              </div>
            </div>
          </header>

          <div className="news-image-full">
            <img src={news.image} alt={news.title} />
          </div>

          <div className="news-content">
            <p className="news-excerpt">{news.excerpt}</p>
            
            <div className="news-full-text">
              <p>Це повний текст новини. Тут може бути багато цікавої інформації, 
                 детальний опис подій, аналіз ситуації та інші важливі деталі.</p>
              
              <p>У реальному додатку цей текст буде завантажуватися з сервера 
                 або бази даних, і може містити різноманітне форматування, 
                 зображення, відео та інші медіа-елементи.</p>

              <p>Новини охоплюють різні теми: політику, економіку, технології, 
                 спорт, культуру та багато іншого. Кожна новина має свою 
                 унікальну цінність та важливість для читачів.</p>
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