/* eslint-disable jest/require-hook */
import BotService from './application/service/BotService';
import container from './cross-cutting/ioc/Container';
import Types from './cross-cutting/ioc/Types';

function start(): void {
  const botService = container.get<BotService>(Types.BotService);
  botService.start();
}

start();
