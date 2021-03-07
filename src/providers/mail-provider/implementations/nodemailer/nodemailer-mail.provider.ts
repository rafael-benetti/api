import SendMailDto from '@providers/mail-provider/contracts/dtos/send-mail.dto';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';

class NodemailerMailProvider implements MailProvider {
  send(data: SendMailDto): void {
    throw new Error('Method not implemented.');
  }
}

export default NodemailerMailProvider;
