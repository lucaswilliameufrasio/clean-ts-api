export interface HashedComparer {
  compare: (plaintext: string, digest: string) => Promise<boolean>
}
