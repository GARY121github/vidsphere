import { Html, Button } from "@react-email/components";
import config from "@/conf/config";

interface ForgotPasswordEmailProps {
  forgotPasswordToken: string;
  username: string;
}

export default function ForgotPasswordEmail({
  forgotPasswordToken,
  username,
}: ForgotPasswordEmailProps) {
  const forgotPasswordUrl = `${config.DEPLOYMENT_URL}/forgot-password?token=${forgotPasswordToken}`;
  return (
    <Html lang="en" dir="ltr">
      <h1>Hi {username},</h1>
      <h2>Reset your password</h2>
      <Button
        href={forgotPasswordUrl}
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
        Reset Password
      </Button>
    </Html>
  );
}
