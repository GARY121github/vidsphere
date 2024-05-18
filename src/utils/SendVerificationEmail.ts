import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verification.email";
import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";

interface SendVerificationEmailProps {
    email: string;
    username: string;
    verifyCode: string;
}

export async function sendVerificationEmail(
    {
        email,
        username,
        verifyCode
    } : SendVerificationEmailProps
): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'VidSphere | VERIFICATION OTP',
            react: VerificationEmail({ verificationCode: verifyCode , username }),
        });
        return new ApiResponse(200, response, "Verification email sent successfully");
    } catch (emailError: any) {
        console.log("Error sending verification email", emailError);
        throw new ApiError(500, "Error sending verification email", [emailError]);
    }
}