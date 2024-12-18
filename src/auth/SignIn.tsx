import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <SignUp path="/signin" routing="path" />
    </div>
  );
};

export default SignInPage;