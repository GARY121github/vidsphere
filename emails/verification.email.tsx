import { Html, Button } from "@react-email/components";
import config from "@/conf/config";

interface VerificationEmailProps {
  verificationCode: string;
  username: string;
}

export default function VerificationEmail({
  verificationCode,
  username,
}: VerificationEmailProps) {
  const verificationCodeUrl = `${config.DEPLOYMENT_URL}/verify/${username}`;
  return (
    <Html lang="en" dir="ltr">
      <h1>Hi {username}, Welcome to VidSphere</h1>
      <h2>Please verify your email address</h2>
      <h1>Verification Code is {verificationCode}</h1>
      <Button
        href={verificationCodeUrl}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "15px 32px",
          textAlign: "center",
          textDecoration: "none",
          display: "inline-block",
          fontSize: "16px",
          borderRadius: "10px",
        }}
      >
        Verify Your Account
      </Button>
    </Html>
  );
}
