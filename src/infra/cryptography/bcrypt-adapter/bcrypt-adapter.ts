import { Hasher } from '@/data/protocols/cryptography/hasher'
import { HashedComparer } from '@/data/protocols/cryptography/hash-comparer'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashedComparer {
  constructor (private readonly salt: number) {}

  async hash (plaintext: string): Promise<string> {
    const digest = await bcrypt.hash(plaintext, this.salt)

    return digest
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(plaintext, digest)

    return isEqual
  }
}
