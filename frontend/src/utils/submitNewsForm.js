import { getCsrfTokenFromCookie } from './api';
import { prepareNewsFormData } from './prepareNewsFormData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Submits news form data to the backend
 * @param {Object} formData - Form data object
 * @param {string} endpoint - API endpoint (e.g., '/news/store' or '/news/{id}/update')
 * @param {string} method - HTTP method ('POST' or 'PATCH')
 * @returns {Promise<Object>} Response data
 */
export const submitNewsForm = async (formData, endpoint, method = 'POST') => {
  const token = getCsrfTokenFromCookie();
  const formDataToSend = prepareNewsFormData(formData, method === 'PATCH' ? 'PATCH' : null);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: method === 'PATCH' ? 'POST' : method,
    body: formDataToSend,
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-XSRF-TOKEN': token,
    },
    credentials: 'include',
  });

  if (response.ok) {
    return await response.json();
  } else {
    // Handle validation errors (422 status)
    if (response.status === 422) {
      const errorData = await response.json();
      throw {
        status: 422,
        errors: errorData.errors || { general: ['Помилка валідації'] }
      };
    } else {
      throw {
        status: response.status,
        errors: { general: ['Помилка при збереженні новини!'] }
      };
    }
  }
};

