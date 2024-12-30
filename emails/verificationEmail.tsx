import * as React from 'react';

interface EmailTemplateProps {
  username: string;
  verifyCode : string ; // also known as the otp
}

export const verificationEmail: React.FC<Readonly<EmailTemplateProps>> = async ({
  username,verifyCode 
}) => (
  <div>
    <h1>VERIFICATION CODE !!!</h1>
    <h2>Welcome, {username}!</h2>
    <h3>the otp is , {verifyCode}!</h3>
    <p>Thank you for registering you can use this otp for your registration!!</p>
    <p>If you havent requested for the code please feel free to ignore it </p>
  </div>
);