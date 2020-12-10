import Datastore from 'nedb';

export default class DatastoreFabric {
  private static internalChatsDatastore: Datastore = null;

  static get chatsDatastore() {
    if (!this.internalChatsDatastore) {
      this.internalChatsDatastore = new Datastore({ filename: 'chats.db', autoload: true });
    }

    return this.internalChatsDatastore;
  }
}
