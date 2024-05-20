import {
    Html
} from "@react-email/components";

interface VerificationEmailProps {
    verificationCode: string;
    username: string;
}

export default function VerificationEmail({ verificationCode , username }: VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <h1>Hi {username}, Welcome to VidSphere</h1>
            <h2>Please verify your email address</h2>
            <h1>Verification Code is {verificationCode}</h1>
        </Html>
    )
}