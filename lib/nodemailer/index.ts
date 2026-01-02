import nodemailer from 'nodemailer';
import {NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";


export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_USER!,
        pass: process.env.NODEMAILER_PASS!,
    }
})


export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);


    const mailOptions = {
        from: `"NextTrade <NextTrade Team@NextTrade.com>"`,
        to: email,
        subject: `Welcome to NextTrade! Start Your Investment Journey Today`,
        text: `Welcome to NextTrade, ${name}! ${intro}`,
        html: htmlTemplate,
    };


    await transporter.sendMail(mailOptions);
}

export const sendDailyNewsEmail = async ({email, newsContent, date}: {
    email: string,
    newsContent: string,
    date: string
}) => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{newsContent}}', newsContent)
        .replace('{{date}}', date);

    const mailOptions = {
        from: `"NextTrade" <News@NextTrade.com>`,
        to: email,
        subject: `Daily Market Insights - ${date}`,
        text: `Here is your daily market summary from NextTrade.`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
}