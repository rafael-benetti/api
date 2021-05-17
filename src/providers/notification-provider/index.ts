import { container } from 'tsyringe';
import NotificationProvider from './contracts/notification.provider';
import FCMProvider from './implementations/fcm.provider';

container.registerSingleton<NotificationProvider>(
  'NotificationProvider',
  FCMProvider,
);
