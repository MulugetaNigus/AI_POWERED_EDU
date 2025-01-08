// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkProvider, RedirectToSignIn, RedirectToSignUp, BrowserRouter } from "@clerk/clerk-react";

// Your Clerk frontend API key
const frontendApi = "https://secure-foal-32.clerk.accounts.dev";
const publishableKey = "pk_test_c2VjdXJlLWZvYWwtMzIuY2xlcmsuYWNjb3VudHMuZGV2JA"

// new = sk_test_j7jHt16WOVIv7XkrlSqEfZX6NOwL5Nm6hIK2lBghfV
// const publishableKey = "pk_test_cmVzb2x2ZWQtcm9kZW50LTYyLmNsZXJrLmFjY291bnRzLmRldiQ"

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ClerkProvider publishableKey={publishableKey} frontendApi={frontendApi} >
    <App />
  </ClerkProvider>
  // {/* </StrictMode> */}
);