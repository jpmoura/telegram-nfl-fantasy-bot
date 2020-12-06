import Datastore from 'nedb';
import { promisify } from 'util';

export default class ChatRepository {
  private readonly db: Datastore;

  private readonly promisifyUpdate: any;

  private readonly promisifyRemove: any;

  constructor() {
    this.db = new Datastore({ filename: 'bot.db', autoload: true });
    this.promisifyUpdate = promisify(this.db.update.bind(this.db));
    this.promisifyRemove = promisify(this.db.remove).bind(this.db);
  }

  async insert(chatId: number) {
    await this.promisifyUpdate({ chatId }, { $set: { chatId } }, { upsert: true });
  }

  list(): any[] {
    return this.db.getAllData().map((item) => item.chatId);
  }

  async delete(chatId: number) {
    await this.promisifyRemove({ chatId }, {});
  }
}
