import FormData from "form-data";
import Mailgun from "mailgun.js";

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
    this.domain = process.env.MAILGUN_DOMAIN || "sandbox888fe0ab71a542a8afbc0e1113d0f1c5.mailgun.org";

    if (!apiKey || !this.domain) {
      console.error(
        "Mailgun configuration missing. Please check your .env file."
      );
    }

    this.mailgunClient = mailgun.client({
      username: "api",
      key: apiKey,
      // When using EU region, specify the endpoint
    //   url: "https://api.eu.mailgun.net",
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
    from: string = `Mailgun Sandbox <postmaster@${this.domain}>`
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
}

export default MailgunClient;
