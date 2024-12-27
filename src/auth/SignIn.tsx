import React from 'react';
import { SignIn, useClerk } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {

  const clerk = useClerk();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <SignIn path="/signin" routing="path" forceRedirectUrl="/on-boarding" />
      <div className='items-start justify-start mt-24'>
      <button onClick={() => clerk.openSignIn({})}>Sign in</button>
        {/* <Link to="/forgot-password" className='text-blue-900 text-decoration-underline'>Forgot your password?</Link> */}
      </div>
    </div>
  );
};

export default SignInPage;