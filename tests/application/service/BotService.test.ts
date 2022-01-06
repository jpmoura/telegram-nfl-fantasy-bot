/* eslint-disable jest/no-hooks */
import 'reflect-metadata';
import faker from 'faker';
import { mock } from 'jest-mock-extended';
import * as schedule from 'node-schedule';
import { Telegraf } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { Logger } from 'tslog';
import BotService from '../../../src/application/service/BotService';
import IChatService from '../../../src/domain/interface/application/service/message/IChatService';
import IMessageService from '../../../src/domain/interface/application/service/message/IMessageService';
import IUpdateService from '../../../src/domain/interface/application/service/update/IUpdateService';
import News from '../../../src/domain/model/News';

jest.mock('node-schedule');

describe('given a bot to manage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('when it starts then should setup the behavior and schedule a update recurrent task', () => {
    expect.hasAssertions();

    const logger = mock<Logger>();
    const telegraf = mock<Telegraf<TelegrafContext>>();
    const cut = new BotService(
      logger,
      telegraf,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );

    cut.start();

    expect(telegraf.start).toHaveBeenCalledTimes(1);
    expect(telegraf.help).toHaveBeenCalledTimes(1);
    expect(telegraf.command).toHaveBeenCalledWith('firstdown', expect.any(Function));
    expect(telegraf.command).toHaveBeenCalledWith('fumble', expect.any(Function));
    expect(telegraf.command).toHaveBeenCalledWith('latest', expect.any(Function));
    expect(telegraf.hears).toHaveBeenCalledWith('Da Bears', expect.any(Function));
    expect(schedule.scheduleJob).toHaveBeenCalledWith('* * * * *', expect.any(Function));
    expect(telegraf.startPolling).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(1);
  });

  describe('when it updates', () => {
    it('and there is no breaking news then should not send any message', async () => {
      expect.hasAssertions();

      const telegraf = mock<Telegraf<TelegrafContext>>();
      const messageService = mock<IMessageService>();
      const chatService = mock<IChatService>();
      chatService.list.mockReturnValue([]);
      const updateService = mock<IUpdateService>();
      updateService.update.mockResolvedValue([]);
      const cut = new BotService(
        mock<Logger>(),
        telegraf,
        undefined,
        undefined,
        undefined,
        messageService,
        chatService,
        updateService,
      );

      cut.start();
      await (schedule.scheduleJob as jest.Mock).mock.calls[0][1](faker.date.recent());

      expect(updateService.update).toHaveBeenCalledTimes(1);
      expect(messageService.send).not.toHaveBeenCalled();
    });

    describe('and there is breaking news', () => {
      it('but there is no subscribed chat then should not send any message', async () => {
        expect.hasAssertions();

        const telegraf = mock<Telegraf<TelegrafContext>>();
        const messageService = mock<IMessageService>();
        const chatService = mock<IChatService>();
        chatService.list.mockReturnValue([]);
        const updateService = mock<IUpdateService>();
        updateService.update.mockResolvedValue([mock<News>()]);
        const cut = new BotService(
          mock<Logger>(),
          telegraf,
          undefined,
          undefined,
          undefined,
          messageService,
          chatService,
          updateService,
        );

        cut.start();
        await (schedule.scheduleJob as jest.Mock).mock.calls[0][1](faker.date.recent());

        expect(updateService.update).toHaveBeenCalledTimes(1);
        expect(messageService.send).not.toHaveBeenCalled();
      });

      it('and there is subscribed chat then should send message to chat', async () => {
        expect.hasAssertions();

        const telegraf = mock<Telegraf<TelegrafContext>>();
        const messageService = mock<IMessageService>();
        const chatService = mock<IChatService>();
        chatService.list.mockReturnValue([faker.datatype.number()]);
        const updateService = mock<IUpdateService>();
        updateService.update.mockResolvedValue([mock<News>()]);
        const cut = new BotService(
          mock<Logger>(),
          telegraf,
          undefined,
          undefined,
          undefined,
          messageService,
          chatService,
          updateService,
        );

        cut.start();
        await (schedule.scheduleJob as jest.Mock).mock.calls[0][1](faker.date.recent());

        expect(updateService.update).toHaveBeenCalledTimes(1);
        expect(messageService.send).toHaveBeenCalledTimes(1);
      });
    });
  });
});
