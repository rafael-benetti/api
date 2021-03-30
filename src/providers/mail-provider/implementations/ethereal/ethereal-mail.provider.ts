import nodemailer, { Transporter } from 'nodemailer';
import SendMailDto from '@providers/mail-provider/contracts/dtos/send-mail.dto';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';
import signUpEmailTemplate from '@providers/mail-provider/templates/sign-up-email-template';

class EtherealMailProvider implements MailProvider {
  private transporter: Transporter;

  private async createTestAccount(): Promise<void> {
    const account = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  }

  async send(data: SendMailDto): Promise<void> {
    if (!this.transporter) {
      await this.createTestAccount();
    }

    const { subject, plainText, htmlBody } = signUpEmailTemplate({
      receiverName: data.receiverName,
      receiverEmail: data.receiverEmail,
      password: data.password,
    });

    const response = await this.transporter.sendMail({
      from: 'Equipe Sttigma',
      to: `${data.receiverName} <${data.receiverEmail}>`,
      subject,
      text: plainText,
      html: htmlBody,
    });

    const previewUrl = nodemailer.getTestMessageUrl(response);

    console.log(previewUrl);
  }
}

export default EtherealMailProvider;
