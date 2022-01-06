import { mockDeep } from 'jest-mock-extended';
import 'reflect-metadata';
import { TelegrafContext } from 'telegraf/typings/context';
import HearingService from '../../../../src/application/service/interaction/HearingService';

describe('given a hearing', () => {
  it('and it is equals "Da Dears" then should reply with a special text for Bears fans', () => {
    expect.hasAssertions();

    const context = mockDeep<TelegrafContext>();
    const cut = new HearingService();

    cut.daBears(context);

    expect(context.reply).toHaveBeenCalledWith('GO BEARS! 🐻⬇️');
  });
});
