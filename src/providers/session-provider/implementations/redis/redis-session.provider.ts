import Redis from 'ioredis';
import { randomBytes } from 'crypto';
import redisConfig from '@config/redis';
import SessionProvider from '@providers/session-provider/contracts/models/session.provider';

class RedisSessionProvider implements SessionProvider {
  private client = new Redis();

  private timeToLive = redisConfig.timeToLive;

  async createToken(userId: string): Promise<string> {
    const token = randomBytes(128).toString('base64');

    await this.client.set(token, userId);
    await this.client.expire(token, redisConfig.timeToLive);

    return token;
  }

  async getTokenOwner(token: string): Promise<string | undefined> {
    const userId = await this.client.get(token);

    if (userId) await this.client.expire(token, this.timeToLive);

    return userId || undefined;
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    const token = randomBytes(128).toString('base64url');

    await this.client.set(token, userId);

    return token;
  }

  async getPasswordResetTokenOwner(token: string): Promise<string | undefined> {
    const userId = await this.client.get(token);

    if (userId) this.client.expire(token, 0);

    return userId || undefined;
  }
}

export default RedisSessionProvider;
