import React, { createContext, useCallback, useContext } from 'react';
import { CssBaseline } from '@mui/material';
import useSnack from '../hooks/useSnack';
import ThemeContextProvider from '../theme';

const HeaderContext = createContext();

const Header = ({ children }) => {
    const { SnackBar, showMessage } = useSnack();

    return (
        <ThemeContextProvider>
            <CssBaseline />
            <HeaderContext.Provider value={{ showMessage }}>
                {children}
                {SnackBar}
            </HeaderContext.Provider>
        </ThemeContextProvider>
    );
};

const useMessage = () => {
    const showMessage = useContext(HeaderContext)?.showMessage;

    const showSuccess = useCallback(
        function (msg) {
            showMessage({ success: msg });
        },
        [showMessage]
    );

    const showError = useCallback(
        function (msg) {
            Array.isArray(msg)
                ? msg.forEach(msg => showMessage({ error: msg }))
                : showMessage({ error: msg });
        },
        [showMessage]
    );

    const showResponse = useCallback(
        function (msg, action) {
            showMessage({ response: msg, action });
        },
        [showMessage]
    );

    return { showError, showSuccess, showResponse };
};

export default Header;

export { useMessage, HeaderContext };
