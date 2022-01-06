import 'reflect-metadata';
import faker from 'faker';
import { mock, mockDeep } from 'jest-mock-extended';
import { TelegrafContext } from 'telegraf/typings/context';
import { Logger } from 'tslog';
import CommandService from '../../../../src/application/service/interaction/CommandService';
import IChatService from '../../../../src/domain/interface/application/service/message/IChatService';
import IMessageService from '../../../../src/domain/interface/application/service/message/IMessageService';
import News from '../../../../src/domain/model/News';

describe('given a received command', () => {
  it('when it is add user then should add user into users list and reply with a confirmation', async () => {
    expect.hasAssertions();

    const chatService = mock<IChatService>();
    const context = mockDeep<TelegrafContext>();
    const cut = new CommandService(mock<Logger>(), undefined, chatService);

    await cut.addUser(context);

    expect(chatService.create).toHaveBeenCalledTimes(1);
    expect(context.reply).toHaveBeenCalledTimes(1);
  });

  it('when it is remove user then should remove user from users list and reply with a confirmation', async () => {
    expect.hasAssertions();

    const chatService = mock<IChatService>();
    const context = mockDeep<TelegrafContext>();
    const cut = new CommandService(mock<Logger>(), undefined, chatService);

    await cut.removeUser(context);

    expect(chatService.delete).toHaveBeenCalledTimes(1);
    expect(context.replyWithMarkdown).toHaveBeenCalledTimes(1);
  });

  describe('when it is send latest', () => {
    it('and there is no news yet then should reply warning the user about it', async () => {
      expect.hasAssertions();

      const messageService = mock<IMessageService>();
      const context = mockDeep<TelegrafContext>();
      const cut = new CommandService(mock<Logger>(), messageService, undefined);

      await cut.sendLatest(context, new Map<string, News>());

      expect(messageService.send).not.toHaveBeenCalled();
      expect(context.reply).toHaveBeenCalledTimes(1);
    });

    it('and there are news then should send the latest', async () => {
      expect.hasAssertions();

      const messageService = mock<IMessageService>();
      const context = mockDeep<TelegrafContext>();
      const news = new Map<string, News>();
      news.set(faker.datatype.string(), mock<News>());
      const cut = new CommandService(mock<Logger>(), messageService, undefined);

      await cut.sendLatest(context, news);

      expect(messageService.send).toHaveBeenCalledTimes(1);
      expect(context.reply).not.toHaveBeenCalled();
    });
  });
});
