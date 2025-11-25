import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCsrfTokenFromCookie } from '../../utils/api';
import './auth.scss';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const EmailVerified = () => {
  const navigate = useNavigate();
  const[success, setSuccess] = useState('')

  const handleGoHome = () => {
    navigate('/');
  };

  const handleCheckEmailVerified = async () => {
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfTokenFromCookie(),
        },
        credentials: 'include',
      });
    
      if (response.ok || response.status === 200) {
        const responseData = await response.json();

        localStorage.setItem('user', JSON.stringify(responseData.user));
        
        if(responseData.user.email_verified){
          setSuccess('Електронну адресу підтверджено!')
        }else{
          setSuccess('Щось сталось не так, спробуйте знову!')
        }
        
      } else {
        console.error('Помилка при верифікації:', response.status);
        
      }
    } catch (error) {
      console.error('Помилка при верифікації:', error);
    }
  };

  useEffect(()=>{
    handleCheckEmailVerified()
  },[])

  return (
    <div className="auth">
      <div className="container">
        <h1 className="page-title">Дякуємо за підтвердження електронної пошти</h1>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Вітаємо!</h2>
            <p>Триває перевірка підтвердження пошти. Зачекайте одну секунду!</p>
  
            {success && (
              <p>{success}</p>
            )}
                
          </div>

          <div className="auth-form">
            <div className="auth-actions">
              {success && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleGoHome}
                >
                  Перейти на головну
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
