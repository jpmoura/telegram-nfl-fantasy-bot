import ChatRepository from '../../../infra/repository/chat/ChatRepository';

export default class ChatService {
  private readonly chatRepository: ChatRepository = new ChatRepository();

  async create(chatId: number): Promise<void> {
    await this.chatRepository.insert(chatId);
  }

  list(): Array<number> {
    return this.chatRepository.list().map((chatId) => Number(chatId));
  }

  async delete(chatId: number): Promise<void> {
    await this.chatRepository.delete(chatId);
  }
}
