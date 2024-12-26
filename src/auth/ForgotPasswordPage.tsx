// ForgotPasswordPage.tsx
import React from "react";
import { SignIn } from "@clerk/clerk-react";  // Clerk's pre-built SignIn component

const ForgotPasswordPage: React.FC = () => {
  return (
    <div>
      <h2>Forgot Password</h2>
      {/* Clerk's SignIn component will handle the forgot password flow automatically */}
      <SignIn path="/forgot-password">
        {/* Forgot Password Step: The user is asked to enter their email to get a reset link */}
        <SignIn.Step name="forgot-password">
          <SignIn.SupportedStrategy name="reset_password_email_code">
            Reset your password via Email
          </SignIn.SupportedStrategy>
          <p>or</p>
          <SignIn.SupportedStrategy name="google">Sign in with Google</SignIn.SupportedStrategy>
        </SignIn.Step>
      </SignIn>
    </div>
  );
};

export default ForgotPasswordPage;
