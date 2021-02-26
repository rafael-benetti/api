interface IHashProvider {
  hash(payload: string): string;
  compare(payload: string, hashed: string): boolean;
}

export default IHashProvider;
