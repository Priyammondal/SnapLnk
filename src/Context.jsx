import { createContext, useContext, useEffect, useState } from 'react';
import useFetch from './hooks/useFetch';
import { getCurrentUser, getCurrentUserFromDb } from './db/apiAuth';

const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const { data, loading, fn: fetchUser } = useFetch(getCurrentUser);
    // const { data, loading, fn: fetchUser } = useFetch(getCurrentUserFromDb);

    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        setUser(data);
    }, [data])

    const isAuthenticated = user?.role === 'authenticated';

    return <UrlContext.Provider value={{ user, loading, fetchUser, isAuthenticated }}>
        {children}
    </UrlContext.Provider>
}

export const UrlState = () => {
    const ctx = useContext(UrlContext);
    if (!ctx) throw new Error('UrlState must be used inside UrlProvider');
    return ctx;
}