import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verification.email";
import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";
import ForgotPasswordEmail from "../../emails/forgot-password.email";
import React from "react";

interface SendVerificationEmailProps {
  email: string;
  emailType: "VERIFICATIONEMAIL" | "FORGOTPASSWORD";
  username: string;
  verificationCode?: string;
  forgotPasswordToken?: string;
}

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  react: JSX.Element;
}

export async function sendEmail({
  email,
  emailType = "VERIFICATIONEMAIL",
  username,
  verificationCode = "",
  forgotPasswordToken = "",
}: SendVerificationEmailProps): Promise<ApiResponse> {
  try {
    if (emailType === "VERIFICATIONEMAIL" && !verificationCode) {
      throw new ApiError(400, "Verification code is required");
    }

    if (emailType === "FORGOTPASSWORD" && !forgotPasswordToken) {
      throw new ApiError(400, "Forgot password token is required");
    }

    const emailOptions: EmailOptions = {
      from: "onboarding@resend.dev",
      to: email,
      subject:
        emailType === "VERIFICATIONEMAIL"
          ? "VidSphere | VERIFICATION OTP"
          : "VidSphere | FORGOT PASSWORD",
      react:
        emailType === "VERIFICATIONEMAIL"
          ? VerificationEmail({ verificationCode, username })
          : ForgotPasswordEmail({ forgotPasswordToken, username }),
    };

    const response = await resend.emails.send({
      ...emailOptions,
    });

    // console.log("Email sent successfully", response);

    if (emailType === "VERIFICATIONEMAIL") {
      return new ApiResponse(200, "Verification email sent successfully");
    } else {
      return new ApiResponse(200, "Forgot password email sent successfully");
    }
  } catch (emailError: any) {
    console.log("Error sending verification email", emailError);
    throw new ApiError(500, "Error sending verification email", [emailError]);
  }
}
