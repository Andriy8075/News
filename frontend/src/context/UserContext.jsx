import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchUser } from '../utils/api';

const UserContext = createContext({
  user: undefined,
  setUser: () => {},
  refreshUser: () => Promise.resolve(undefined),
  loading: true,
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const fetchedUser = await fetchUser();
      setUser(fetchedUser ?? null);
      return fetchedUser ?? null;
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      refreshUser: loadUser,
      loading,
    }),
    [user, loadUser, loading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

