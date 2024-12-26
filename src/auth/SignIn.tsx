import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const SignInPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <SignIn path="/signin" routing="path" forceRedirectUrl="/on-boarding"  />
      <div className='items-start justify-start mt-24'>
        {/* <Link to="/forgot-password" className='text-blue-900 text-decoration-underline'>Forgot your password?</Link> */}
      </div>
    </div>
  );
};

export default SignInPage;