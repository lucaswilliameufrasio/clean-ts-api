import { AddAccount } from '@/domain/usecases/add-account'
import { Authentication } from '@/domain/usecases/authentication'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/../tests/domain/mocks'
import faker from 'faker'

export class AddAccountSpy implements AddAccount {
  isValid = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account
    return this.isValid
  }
}
export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params
  authenticationModel = {
    accessToken: faker.random.uuid(),
    name: faker.name.findName()
  }

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authenticationParams
    return this.authenticationModel
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel()
  accessToken: string
  role: string

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken
    this.role = role
    return this.accountModel
  }
}
