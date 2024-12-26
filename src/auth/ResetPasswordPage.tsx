// ResetPasswordPage.tsx
import React from "react";
import { SignIn } from "@clerk/clerk-react";  // Clerk's pre-built SignIn component

const ResetPasswordPage: React.FC = () => {
  return (
    <div>
      <h2>Reset Your Password</h2>
      <SignIn path="/reset-password">
        {/* Reset Password Step: The user is asked to input a new password */}
        <SignIn.Step name="reset-password">
          <Clerk.Field name="password">
            <Clerk.Label>New Password</Clerk.Label>
            <Clerk.Input />
            <Clerk.FieldError />
          </Clerk.Field>
          <Clerk.Field name="confirmPassword">
            <Clerk.Label>Confirm Password</Clerk.Label>
            <Clerk.Input />
            <Clerk.FieldError />
          </Clerk.Field>
          <SignIn.Action submit>Update Password</SignIn.Action>
        </SignIn.Step>
      </SignIn>
    </div>
  );
};

export default ResetPasswordPage;
