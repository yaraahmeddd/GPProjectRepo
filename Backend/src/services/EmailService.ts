import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initTransporter();
    }

    private async initTransporter() {
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            console.log('No SMTP credentials found. Generating Ethereal test account...');
            try {
                const testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass  // generated ethereal password
                    }
                });
                console.log('✅ Ethereal test account ready. Emails will be caught by Ethereal.');
            } catch (err) {
                console.error('Failed to create Ethereal account:', err);
            }
        }
    }

    async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
        // Wait for transporter to initialize if it's not ready
        let retries = 0;
        while (!this.transporter && retries < 10) {
            await new Promise(res => setTimeout(res, 500));
            retries++;
        }

        if (!this.transporter) {
            console.error('Email transporter not initialized!');
            return;
        }

        const mailOptions = {
            from: '"HUC Support" <noreply@huc.edu.eg>',
            to,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>You recently requested to reset your password for your HUC account.</p>
                    <p>Click the button below to reset it:</p>
                    <a href="${resetLink}" style="background-color: #2596be; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next 1 hour.</p>
                    <p>Thanks,<br>The HUC Team</p>
                </div>
            `
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('\n======================================================');
            console.log('📧 EMAIL SENT SUCCESSFULLY!');
            console.log(`To: ${to}`);
            console.log(`Subject: Password Reset Request`);
            console.log(`Message ID: ${info.messageId}`);
            
            // If using Ethereal, log the preview URL
            if (info.messageId && nodemailer.getTestMessageUrl(info)) {
                console.log(`\n🔗 CLICK HERE TO VIEW EMAIL IN BROWSER:`);
                console.log(`${nodemailer.getTestMessageUrl(info)}`);
            }
            console.log('======================================================\n');
        } catch (error) {
            console.error('Error sending email:', error);
            // Fallback for development if nodemailer fails
            console.log('\n🔗 Reset Link (Fallback):', resetLink, '\n');
        }
    }
}

export default new EmailService();
