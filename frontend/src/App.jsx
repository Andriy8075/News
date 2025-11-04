import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import NewsFeed from './pages/newsFeed/newsFeed';
import NewsDetail from './pages/newsDetails/newsDetails';
import CreateNews from './pages/createNews/createNews';
import Profile from './pages/profile/profile';
import './styles/main.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<NewsFeed />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/create" element={<CreateNews />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;