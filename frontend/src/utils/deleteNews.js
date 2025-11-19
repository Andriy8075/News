import { getCsrfTokenFromCookie } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Deletes a news item
 * @param {number} newsId - ID of the news item to delete
 * @returns {Promise<Object>} Response data
 */
export const deleteNews = async (newsId) => {
  const token = getCsrfTokenFromCookie();
  
  const response = await fetch(`${API_BASE_URL}/news/${newsId}/delete`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': token,
    },
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Failed to delete news: ${response.status}`);
  }
};

