import { injectable } from 'inversify';
import { TelegrafContext } from 'telegraf/typings/context';
import IHearingService from '../../../domain/interface/application/service/interaction/IHearingService';

@injectable()
export default class HearingService implements IHearingService {
  daBears(ctx: TelegrafContext): void {
    ctx.reply('GO BEARS! 🐻⬇️');
  }
}
