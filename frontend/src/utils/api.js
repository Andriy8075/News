const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function getCsrfTokenFromCookie() {
  if (!document.cookie) {
    console.log('no cookie');
    return null;
  }

  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith('XSRF-TOKEN='));

  if (xsrfCookies.length === 0) {
    console.log('no xsrf cookie');
    return null;
  }
  const toReturn = decodeURIComponent(xsrfCookies[0].split('=')[1]);
  console.log('toReturn', toReturn);
  return toReturn;
}

export async function fetchCsrfToken() {
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
      return getCsrfTokenFromCookie();
    } else {
      console.error('Failed to fetch CSRF token:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
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
