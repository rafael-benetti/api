import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import { hashSync, compareSync } from 'bcrypt';

class BcryptHashProvider implements HashProvider {
  hash(payload: string): string {
    return hashSync(payload, 10);
  }

  compare(payload: string, hashed: string): boolean {
    return compareSync(payload, hashed);
  }
}

export default BcryptHashProvider;
