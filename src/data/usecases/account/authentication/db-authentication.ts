import {
  Authentication,
  AuthenticationParams,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  HashedComparer,
  Encrypter
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashedComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email)

    if (account) {
      const isEqual = await this.hashComparer.compare(authenticationParams.password, account.password)

      if (isEqual) {
        const accessToken = await this.encrypter.encrypt(account.id)

        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

        return accessToken
      }
    }

    return null
  }
}
