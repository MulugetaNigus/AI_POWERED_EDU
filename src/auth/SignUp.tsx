import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <SignUp path="/signup" routing="path" forceRedirectUrl="/signin" />
    </div>
  );
};

export default SignUpPage;