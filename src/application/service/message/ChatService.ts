import { inject, injectable } from 'inversify';
import Types from '../../../cross-cutting/ioc/Types';
import IChatService from '../../../domain/interface/application/service/message/IChatService';
import IChatRepository from '../../../domain/interface/infra/repository/message/IChatRepository';

@injectable()
export default class ChatService implements IChatService {
  constructor(@inject(Types.ChatRepository) private readonly chatRepository: IChatRepository) { }

  async create(chatId: number): Promise<void> {
    await this.chatRepository.insert(chatId);
  }

  list(): Array<number> {
    return this.chatRepository.list();
  }

  async delete(chatId: number): Promise<void> {
    await this.chatRepository.delete(chatId);
  }
}
