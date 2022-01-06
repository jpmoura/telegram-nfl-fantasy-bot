import { mockDeep } from 'jest-mock-extended';
import 'reflect-metadata';
import { TelegrafContext } from 'telegraf/typings/context';
import GlobalService from '../../../../src/application/service/interaction/GlobalService';

describe('given a global command', () => {
  it('and it is a start command then should reply with greetings text', () => {
    expect.hasAssertions();

    const context = mockDeep<TelegrafContext>();
    const cut = new GlobalService();

    cut.start(context);

    expect(context.replyWithMarkdown).toHaveBeenCalledTimes(1);
  });

  it('and it is a help command then should reply with a helper text', () => {
    expect.hasAssertions();

    const context = mockDeep<TelegrafContext>();
    const cut = new GlobalService();

    cut.help(context);

    expect(context.replyWithMarkdown).toHaveBeenCalledTimes(1);
  });
});
