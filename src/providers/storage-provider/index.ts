import { container } from 'tsyringe';
import StorageProvider from './contracts/models/storage.provider';
import AwsStorageProvider from './implementations/aws/aws-storage.provider';

container.registerSingleton<StorageProvider>(
  'StorageProvider',
  AwsStorageProvider,
);
