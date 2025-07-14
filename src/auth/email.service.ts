import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const appName = this.configService.get<string>('app.name');
    const appUrl = this.configService.get<string>('app.url');
    const verificationUrl = `${appUrl}/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to: email,
      subject: `${appName} - Email Doğrulama`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Doğrulama</h2>
          <p>Merhaba,</p>
          <p>${appName} sistemine kaydınız için email adresinizi doğrulamanız gerekmektedir.</p>
          <p>Aşağıdaki butona tıklayarak email adresinizi doğrulayabilirsiniz:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Email Adresimi Doğrula
          </a>
          <p>Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>Bu link 24 saat geçerlidir.</p>
          <hr>
          <p><small>Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</small></p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const appName = this.configService.get<string>('app.name');
    const appUrl = this.configService.get<string>('app.url');
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('email.from'),
      to: email,
      subject: `${appName} - Şifre Sıfırlama`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Şifre Sıfırlama</h2>
          <p>Merhaba,</p>
          <p>Şifre sıfırlama talebiniz alındı.</p>
          <p>Aşağıdaki butona tıklayarak yeni şifre oluşturabilirsiniz:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Şifremi Sıfırla
          </a>
          <p>Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Bu link 1 saat geçerlidir.</p>
          <p><strong>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</strong></p>
          <hr>
          <p><small>Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</small></p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
