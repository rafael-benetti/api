import PublishMqttDto from '../dtos/publish-mqtt.dto';

export default interface MqttProvider {
  publish({ payload, topic }: PublishMqttDto): Promise<void>;
}
