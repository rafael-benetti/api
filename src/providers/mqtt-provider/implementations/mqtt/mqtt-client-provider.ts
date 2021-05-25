import logger from '@config/logger';
import PublishMqttDto from '@providers/mqtt-provider/contracts/dtos/publish-mqtt.dto';
import MqttProvider from '@providers/mqtt-provider/contracts/models/mqtt-provider';
import mqtt from 'mqtt';

export default class MqttClientProvider implements MqttProvider {
  private client = mqtt.connect('mqtt://broker.sttigma.com', {
    clientId: 'sttigma-api',
    port: 1883,
    protocol: 'mqtt',
  });

  async publish({ payload, topic }: PublishMqttDto): Promise<void> {
    logger.info(this.client.connected);
    this.client.publish(topic, payload, {
      qos: 1,
    });
  }
}
