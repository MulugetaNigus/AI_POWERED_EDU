// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkProvider, RedirectToSignIn, RedirectToSignUp, BrowserRouter } from "@clerk/clerk-react";

// Your Clerk frontend API key
const frontendApi = "https://secure-foal-32.clerk.accounts.dev";
const publishableKey = "pk_test_c2VjdXJlLWZvYWwtMzIuY2xlcmsuYWNjb3VudHMuZGV2JA"

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ClerkProvider publishableKey={publishableKey} frontendApi={frontendApi} >
    <App />
  </ClerkProvider>
  // {/* </StrictMode> */}
);
