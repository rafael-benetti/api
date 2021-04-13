import { container } from 'tsyringe';
import MailProvider from './contracts/models/mail.provider';
import NodemailerMailProvider from './implementations/nodemailer/nodemailer-mail.provider';

container.registerSingleton<MailProvider>(
  'MailProvider',
  NodemailerMailProvider,
);
