import React from 'react';
import { Navigate } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');

    let isAuthenticated = false;

    if (token) {
        try {
            // const decoded = jwtDecode(token);
            // const currentTime = Date.now() / 1000;
            isAuthenticated = true
        } catch (error) {
            console.error("Token verification failed:", error);
        }
    }

    return isAuthenticated ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;