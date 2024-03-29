import { Hasher, HashedComparer, Encrypter, Decrypter } from '@/data/protocols/cryptography'
import { faker } from '@faker-js/faker'

export class DecrypterSpy implements Decrypter {
  plaintext = faker.internet.password()
  ciphertext: string

  async decrypt (ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext

    return this.plaintext
  }
}
export class EncrypterSpy implements Encrypter {
  ciphertext = faker.random.uuid()
  plaintext: string

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.ciphertext
  }
}
export class HasherSpy implements Hasher {
  digest = faker.random.uuid()
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.digest
  }
}

export class HashedComparerSpy implements HashedComparer {
  plaintext = faker.internet.password()
  digest = faker.random.uuid()
  isValid = true

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return this.isValid
  }
}
