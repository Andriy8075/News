const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GETFetch = async (url) => {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data;
        } else {
          console.error('Failed to fetch data:', response.status);
        }
    } catch (err) {
        console.error('Error fetching data', err);
    }
}