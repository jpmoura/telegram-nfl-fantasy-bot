import { injectable } from 'inversify';
import StormDB from 'stormdb';
import IChatRepository from '../../../domain/interface/infra/repository/message/IChatRepository';

const dbFilename = 'chats';

type DbSchema = {
  chats: Array<number>;
};

@injectable()
export default class ChatRepository implements IChatRepository {
  protected readonly db: StormDB;

  constructor() {
    const engine = new StormDB.localFileEngine(`./${dbFilename}.db`, {
      async: true,
    });
    this.db = new StormDB(engine);
    this.db.default({ chats: [] } as DbSchema);
  }

  async insert(chatId: number) {
    this.db.get(dbFilename).push(chatId);
    await this.db.save();
  }

  list(): Array<number> {
    return this.db.get(dbFilename).value();
  }

  async delete(chatId: number) {
    const chats: Array<number> = this.db.get(dbFilename).value();
    const updatedChats = chats.filter((currentChatId: number) => currentChatId !== chatId);
    this.db.get(dbFilename).set(updatedChats);
    await this.db.save();
  }
}
