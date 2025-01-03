import React from 'react';
import { SignIn, useClerk } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {

  const clerk = useClerk();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <SignIn path="/signin" routing="path" forceRedirectUrl="/on-boarding" />
    </div>
  );
};

export default SignInPage;