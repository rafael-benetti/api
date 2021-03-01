import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import { v4 } from 'uuid';

class FakeSessionProvider implements SessionProvider {
  private sessions: {
    [key: string]: string;
  } = {};

  async createToken(userId: string): Promise<string> {
    const sessionToken = v4();
    this.sessions[sessionToken] = userId;
    return sessionToken;
  }

  async getTokenOwner(token: string): Promise<string | undefined> {
    return this.sessions[token];
  }
}

export default FakeSessionProvider;
