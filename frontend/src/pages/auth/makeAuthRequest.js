import { getCsrfToken } from '../../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function makeAuthRequest(type, formData) {
    return await fetch(`${API_BASE_URL}/${type}`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': getCsrfToken() 
        },
        credentials: 'include',
      });
}