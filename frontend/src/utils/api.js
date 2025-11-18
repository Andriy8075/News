import { data } from '../data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
let csrfToken = null;

function getCsrfTokenFromCookie() {
  const name = 'XSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export async function fetchCsrfToken() {
  // Check if token already exists in variable or in cookie - no need to fetch if it does
  if (csrfToken) return csrfToken;
  const tokneInCookie = getCsrfTokenFromCookie();
  if (tokneInCookie) {
    return tokneInCookie;
  }

  // Only fetch if token doesn't exist
  try {
    const response = await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include', // Important: include cookies
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      // Extract token from cookie
      csrfToken = getCsrfTokenFromCookie();
      return csrfToken;
    } else {
      console.error('Failed to fetch CSRF token:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
}

export function getCsrfToken() {
  if (!csrfToken) {
    csrfToken = getCsrfTokenFromCookie();
  }
  return csrfToken;
}

export async function fetchUser() {
  const response = await fetch(`${API_BASE_URL}/user`, {
    credentials: 'include',
  })
  if (response.ok) {
    const responseData = await response.json();
    return responseData.user;
  } else {
    console.error('Failed to fetch user:', response.status);
    return null;
  }
}

// /**
//  * Make an authenticated API request with CSRF token
//  * @param {string} endpoint - API endpoint (e.g., '/api/news')
//  * @param {object} options - Fetch options (method, body, headers, etc.)
//  * @returns {Promise<Response>}
//  */
// export async function apiRequest(endpoint, options = {}) {
//   // Ensure we have a CSRF token
//   let token = getCsrfToken();
//   if (!token) {
//     // Try to fetch if not available
//     token = await fetchCsrfToken();
//   }

//   const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
//   const defaultHeaders = {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'X-Requested-With': 'XMLHttpRequest',
//   };

//   // Add CSRF token to headers if available
//   if (token) {
//     defaultHeaders['X-XSRF-TOKEN'] = token;
//   }

//   const config = {
//     ...options,
//     credentials: 'include', // Important: include cookies for Sanctum
//     headers: {
//       ...defaultHeaders,
//       ...options.headers,
//     },
//   };

//   // If Content-Type is being set to something else (e.g., for FormData), don't override
//   if (options.headers && options.headers['Content-Type'] === 'multipart/form-data') {
//     delete config.headers['Content-Type'];
//   }

//   return fetch(url, config);
// }

// /**
//  * Get the base API URL
//  */
// export function getApiBaseUrl() {
//   return API_BASE_URL;
// }

