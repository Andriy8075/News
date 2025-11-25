import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import NewsFeed from './pages/newsFeed/newsFeed';
import NewsDetail from './pages/newsDetails/newsDetails';
import CreateNews from './pages/createNews/createNews';
import Profile from './pages/profile/profile';
import './styles/main.scss';
import Register from './pages/auth/register';
import Login from './pages/auth/login';
import EditNews from './pages/editNews/editNews';
import MyNews from './pages/myNews/myNews';
import EmailVerified from './pages/auth/emailVerified';
import ForgotPassword from './pages/auth/forgotPassword';
import ResetPassword from './pages/auth/resetPassword';

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
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/news/:id/edit" element={<EditNews />} />
            <Route path="/my-news" element={<MyNews />} />
            <Route path="/email-verified" element={<EmailVerified />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/password-reset/:token" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;