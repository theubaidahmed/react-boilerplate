import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
// import AuthorizationProvider from '../hooks/Authorize';

const AuthorizeRouter = () => {
    return (
        // <AuthorizationProvider>
        <Navbar>
            <Outlet />
        </Navbar>
        // </AuthorizationProvider>
    );
};

export default AuthorizeRouter;
