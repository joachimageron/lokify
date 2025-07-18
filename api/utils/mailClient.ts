import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

class MailClient {
  private static instance: MailClient;
  private transporter: any;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  public static getInstance(): MailClient {
    if (!MailClient.instance) {
      MailClient.instance = new MailClient();
    }
    return MailClient.instance;
  }

  public async sendEmail(
    to: string[],
    subject: string,
    text: string,
    html?: string,
    from: string = `Lokify <no-reply@lokify.com>`
  ): Promise<any> {
    try {
      const messageData: any = {
        from,
        to: to.join(', '), // nodemailer accepte la liste séparée par virgule
        subject,
        text,
      };

      if (html) {
        messageData.html = html;
      }

      const response = await this.transporter.sendMail(messageData);
      return response;
    } catch (error) {
      console.error('Error sending email via Mailtrap:', error);
      throw error;
    }
  }

  public async renderEmailTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(context);
  }

  public async sendEmailWithTemplate(
    to: string[],
    subject: string,
    templateName: string,
    context: any
  ) {
    const htmlContent = await this.renderEmailTemplate(templateName, context);
    // Pour le texte brut, on retire les balises html
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    return this.sendEmail(to, subject, textContent, htmlContent);
  }
}

export default MailClient;
