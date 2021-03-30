import { container } from 'tsyringe';
import MailProvider from './contracts/models/mail.provider';
import EtherealMailProvider from './implementations/ethereal/ethereal-mail.provider';

container.registerSingleton<MailProvider>('MailProvider', EtherealMailProvider);
