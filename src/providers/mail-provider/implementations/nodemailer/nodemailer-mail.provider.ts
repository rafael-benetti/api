import mailConfig from '@config/mail';
import { createTransport } from 'nodemailer';
import SendMailDto from '@providers/mail-provider/contracts/dtos/send-mail.dto';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';

class NodemailerMailProvider implements MailProvider {
  private transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass,
    },
  });

  send(data: SendMailDto): void {
    this.transporter.sendMail({
      from: {
        name: 'Equipe Sttigma',
        address: mailConfig.user,
      },
      to: {
        name: 'Nome',
        address: data.to,
      },
      subject: data.subject,
      html: data.body,
    });
  }
}

export default NodemailerMailProvider;
