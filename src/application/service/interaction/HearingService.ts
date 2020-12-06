import { TelegrafContext } from 'telegraf/typings/context';

export default class HearingService {
  daBears(ctx: TelegrafContext): void {
    ctx.reply('GO BEARS! 🐻⬇️');
  }
}
