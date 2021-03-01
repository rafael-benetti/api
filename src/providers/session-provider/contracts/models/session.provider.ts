interface SessionProvider {
  createToken(userId: string): Promise<string>;
  getTokenOwner(token: string): Promise<string | undefined>;
}

export default SessionProvider;
