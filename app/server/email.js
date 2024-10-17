import nodemailer from 'nodemailer';

export async function sendEmailNotification(receipts,title, subject, html) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, 
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_TITLE,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_TITLE,
        to: receipts,
        subject: subject,
        html: html,
    };
    await transporter.sendMail(mailOptions);
}