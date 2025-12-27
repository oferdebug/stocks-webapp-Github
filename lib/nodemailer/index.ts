import nodemailer from 'nodemailer';
import { WELCOME_EMAIL_TEMPLATE } from "@/lib/nodemailer/templates";

{/* Senior Note: Using a single transporter instance is best practice for connection pooling. */}
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    }
});

interface WelcomeEmailData {
    name: string;
    intro: string;
    email: string;
}

const sendWelcomeEmail = async ({ name, intro, email }: WelcomeEmailData) => {
    try {
        {/* Type assertion to string ensures .replace works and the IDE is happy */}
        const template = WELCOME_EMAIL_TEMPLATE as string;

        const HtmlTemplate = template
            .replace('{{name}}', name)
            .replace('{{intro}}', intro);

        const mailOptions = {
            from: `"NextTrade" <${process.env.NODEMAILER_USER}>`, // Best practice: using the authenticated user as sender
            to: email,
            subject: 'Welcome to NextTrade! - Your Smart Trading Market Is Ready Inside.',
            text: `Welcome to NextTrade, ${name}!`,
            html: HtmlTemplate,
        };

        {/* Senior Tip: Always log the attempt and the result for easier debugging in production */}
        console.log(`[Nodemailer] Attempting to send email to: ${email}`);

        const info = await transporter.sendMail(mailOptions);

        console.log(`[Nodemailer] Email sent successfully! MessageID: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error("[Nodemailer] Critical Error during email sending:", error);
        throw error; // Re-throw so Inngest knows the step failed
    }
};

export default sendWelcomeEmail;