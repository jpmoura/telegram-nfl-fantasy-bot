import { inject, injectable } from 'inversify';
import { Message } from 'telegraf/typings/telegram-types';
import Types from '../../../cross-cutting/ioc/Types';
import IMessageService from '../../../domain/interface/application/service/message/IMessageService';
import IMessageRepository from '../../../domain/interface/infra/repository/message/IMessageRepository';
import News from '../../../domain/model/News';

@injectable()
export default class MessageService implements IMessageService {
  constructor(
    @inject(Types.MessageRepository) private readonly messageRepository: IMessageRepository,
  ) { }

  send(chatId: number, news: News): Promise<Message> {
    return this.messageRepository.send(chatId, news.toString());
  }
}
