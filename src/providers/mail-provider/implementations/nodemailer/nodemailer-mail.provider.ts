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
    throw new Error('Method not implemented.');
  }
}

export default NodemailerMailProvider;
