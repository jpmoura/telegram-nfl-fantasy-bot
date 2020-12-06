import { Telegram } from 'telegraf';
import { Message } from 'telegraf/typings/telegram-types';
import News from '../../../domain/model/News';
import MessageRepository from '../../../infra/repository/message/MessageRepository';

export default class MessageService {
  private messageRepository: MessageRepository;

  constructor(mailman: Telegram) {
    this.messageRepository = new MessageRepository(mailman);
  }

  send(chatId: number, news: News): Promise<Message> {
    return this.messageRepository.send(chatId, news.toString());
  }
}
