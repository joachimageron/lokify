import FormData from "form-data";
import Mailgun from "mailgun.js";
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

/**
 * Singleton class for Mailgun email service
 */
class MailgunClient {
  private static instance: MailgunClient;
  private mailgunClient: any;
  private domain: string;

  private constructor() {
    const mailgun = new Mailgun(FormData);
    const apiKey = process.env.MAILGUN_API_KEY || "";
    this.domain = process.env.MAILGUN_DOMAIN || "lokify.ageronjoachim.com";

    if (!apiKey || !this.domain) {
      console.error(
        "Mailgun configuration missing. Please check your .env file."
      );
    }

    this.mailgunClient = mailgun.client({
      username: "api",
      key: apiKey,
      // When using EU region, specify the endpoint
      url: "https://api.eu.mailgun.net",
    });
  }

  /**
   * Get the singleton instance of MailgunClient
   */
  public static getInstance(): MailgunClient {
    if (!MailgunClient.instance) {
      MailgunClient.instance = new MailgunClient();
    }
    return MailgunClient.instance;
  }

  /**
   * Send an email using Mailgun
   * @param to Recipient email addresses array
   * @param subject Email subject
   * @param text Plain text email content
   * @param html HTML email content (optional)
   * @param from Sender email address (optional)
   * @returns Promise with Mailgun response
   */
  public async sendEmail(
    to: string[],
    subject: string,
    text: string,
    html?: string,
    from: string = `Lokify <no-reply@${this.domain}>`
  ): Promise<any> {
    try {
      const messageData: any = {
        from,
        to,
        subject,
        text
      };

      // Add HTML content if provided
      if (html) {
        messageData.html = html;
      }

      console.log("Sending email via Mailgun:", messageData);

      const response = await this.mailgunClient.messages.create(this.domain, messageData);
      console.log("Email sent successfully:", response);
      return response;
    } catch (error) {
      console.error("Error sending email via Mailgun:", error);
      throw error;
    }
  }

  // Add a method to render templates
  public async renderEmailTemplate(templateName: string, context: any): Promise<string> {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    return template(context);
  }

  // Then use it with your sendEmail method
  public async sendEmailWithTemplate(
    to: string[],
    subject: string,
    templateName: string,
    context: any
  ) {
    const htmlContent = await this.renderEmailTemplate(templateName, context);
    return this.sendEmail(to, subject, htmlContent.replace(/<[^>]*>/g, ''), htmlContent);
  }
}

export default MailgunClient;
