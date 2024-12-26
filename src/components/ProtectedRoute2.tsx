import React from "react";
import { Navigate } from "react-router-dom";  // Use Navigate instead of Redirect
import { useUser } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute2: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute2;
