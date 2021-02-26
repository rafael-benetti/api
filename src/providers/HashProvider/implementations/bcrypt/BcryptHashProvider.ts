import IHashProvider from 'providers/HashProvider/contracts/models/IHashProvider';
import { hashSync, compareSync } from 'bcrypt';

class BcryptHashProvider implements IHashProvider {
  hash(payload: string): string {
    return hashSync(payload, 8);
  }

  compare(payload: string, hashed: string): boolean {
    return compareSync(payload, hashed);
  }
}

export default BcryptHashProvider;
