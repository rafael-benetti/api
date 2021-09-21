import PublishMqttDto from '@providers/mqtt-provider/contracts/dtos/publish-mqtt.dto';
import MqttProvider from '@providers/mqtt-provider/contracts/models/mqtt-provider';
import mqtt from 'mqtt';

export default class MqttClientProvider implements MqttProvider {
  private client = mqtt.connect('mqtt://broker.blacktelemetry.com', {
    clientId: 'black-telemetry-api',
    port: 1883,
    protocol: 'mqtt',
  });

  async publish({ payload, topic }: PublishMqttDto): Promise<void> {
    this.client.publish(topic, payload, {
      qos: 1,
    });
  }
}
