import SendMailDto from '../dtos/send-mail.dto';

interface MailProvider {
  send(data: SendMailDto): void;
}

export default MailProvider;
