import { MongoClient, Collection, Document } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    const client = await MongoClient.connect(uri)
    this.client = client
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollection <CollectionProps = any>(name: string): Promise<Collection<CollectionProps & Document>> {
    return this.client.db().collection(name)
  },

  map: (data: any): any => {
    const { _id, ...rest } = data

    return Object.assign({}, rest, { id: _id })
  },

  mapCollection: (collection: any[]): any[] => {
    return collection.map(document => MongoHelper.map(document))
  }

}
