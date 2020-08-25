export interface HashedComparer {
  compare: (value: string, hash: string) => Promise<boolean>
}
