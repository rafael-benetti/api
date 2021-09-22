import mailConfig from '@config/mail';
import { createTransport } from 'nodemailer';
import SendMailDto from '@providers/mail-provider/contracts/dtos/send-mail.dto';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';

class NodemailerMailProvider implements MailProvider {
  private transporter = createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass,
    },
  });

  send(data: SendMailDto): void {
    this.transporter.sendMail({
      from: {
        name: 'Equipe Black Telemetry',
        address: 'no-reply@blacktelemetyr.com',
      },
      to: {
        name: data.receiverName,
        address: data.receiverEmail,
      },
      subject: data.subject,
      html: data.html,
      text: data.text,
    });
  }
}

export default NodemailerMailProvider;
