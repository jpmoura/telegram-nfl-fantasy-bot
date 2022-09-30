import { inject, injectable } from 'inversify';
import { Config, JsonDB } from 'node-json-db';
import Types from '../../../cross-cutting/ioc/Types';
import ILogger from '../../../domain/interface/infra/repository/log/ILogger';
import IChatRepository from '../../../domain/interface/infra/repository/message/IChatRepository';
import fs from 'fs';

@injectable()
export default class ChatRepository implements IChatRepository {
  private readonly db: JsonDB;

  private chats: number[] = [];

  constructor(@inject(Types.Logger) private readonly logger: ILogger) {
    const filename = 'chats.json';
    this.db = new JsonDB(new Config(filename, true, false, '/', true));

    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, JSON.stringify({ chats: this.chats }));
    } else {
      this.list().then(() => this.logger.info('Chat Repository initialized'));
    }
  }

  async insert(chatId: number) {
    this.chats.push(chatId);
    await this.db.push('/chats', this.chats, true);
  }

  async list(): Promise<Array<number>> {
    try {
      this.chats = await this.db.getData('/chats');
    } catch (error) {
      this.logger.error('Error while trying to read from DB', error);
    }

    return this.chats;
  }

  async delete(chatId: number) {
    const currentChats = await this.list();
    this.chats = currentChats.filter((currentChatId) => currentChatId !== chatId);
    await this.db.push('/chats', this.chats, true);
  }
}
