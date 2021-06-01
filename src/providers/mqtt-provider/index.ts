import { container } from 'tsyringe';
import MqttProvider from './contracts/models/mqtt-provider';
import MqttClientProvider from './implementations/mqtt/mqtt-client-provider';

container.registerSingleton<MqttProvider>('MqttProvider', MqttClientProvider);
