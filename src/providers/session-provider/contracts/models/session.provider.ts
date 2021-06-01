interface SessionProvider {
  createToken(userId: string): Promise<string>;
  getTokenOwner(token: string): Promise<string | undefined>;
  createPasswordResetToken(userId: string): Promise<string>;
  getPasswordResetTokenOwner(token: string): Promise<string | undefined>;
}

export default SessionProvider;
