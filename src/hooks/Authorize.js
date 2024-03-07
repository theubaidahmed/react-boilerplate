import React, { createContext, useContext, useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { getCookie, clearCookie } from '../utilities/cookies';
import { env } from '../utilities/function';
import { authServer } from '../utilities/axiosPrototypes';

const authorizeContext = createContext();

const AuthorizationProvider = ({ children }) => {
    const token = getCookie('accessToken');
    const [content, setContent] = useState(token ? children : 'Login');
    const [user, setUser] = useState({});

    const authorize = async (loggedIn, cb) => {
        if (loggedIn) {
            setContent(children);
        } else {
            setContent('Login');
        }
        if (typeof cb === 'function') cb(setUser);
    };

    useEffect(() => {
        (async () => {
            try {
                if (!token) throw new Error('token not found');
                const response = await authServer.get(`URL to fetch user profile with stored token`);
                const user = response.data.user;

                authorize(true, setUser => setUser(user));
            } catch (err) {
                console.log(err);
                clearCookie('accessToken');
                authorize(false);
            }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <authorizeContext.Provider value={{ authorize, setUser, user, setContent }}>
            {content}
        </authorizeContext.Provider>
    );
};

const useAuthorize = () => useContext(authorizeContext).authorize;
const useUser = () => useContext(authorizeContext)?.user;
const useSetUser = () => useContext(authorizeContext).setUser;
const useSetContent = () => useContext(authorizeContext).setContent;

export default AuthorizationProvider;
export { useAuthorize, useUser, useSetUser, useSetContent };
