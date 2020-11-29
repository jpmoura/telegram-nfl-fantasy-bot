import { TelegrafContext } from 'telegraf/typings/context';

export default interface IGlobalService {
  start(ctx: TelegrafContext): void;
  help(ctx: TelegrafContext): void;
}
