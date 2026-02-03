import { createContext, useContext, useEffect, useState } from 'react';
import useFetch from './hooks/useFetch';
import { getCurrentUser } from './db/apiAuth';

const UrlContext = createContext();

export const UrlProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [urls, setUrls] = useState(null);

    const { data, loading, fn: fetchUser } = useFetch(getCurrentUser);

    useEffect(() => {
        setUser(data);
    }, [data]);

    useEffect(() => {
        fetchUser();
    }, []);

    const isAuthenticated = Boolean(user?.id);

    return (
        <UrlContext.Provider
            value={{ user, setUser, loading, fetchUser, isAuthenticated, urls, setUrls }}
        >
            {children}
        </UrlContext.Provider>
    );
};


export const UrlState = () => {
    const ctx = useContext(UrlContext);
    if (!ctx) throw new Error('UrlState must be used inside UrlProvider');
    return ctx;
}