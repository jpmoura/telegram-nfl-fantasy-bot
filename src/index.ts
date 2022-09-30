/* eslint-disable jest/require-hook */
import container from './cross-cutting/ioc/Container';
import Types from './cross-cutting/ioc/Types';
import IBotService from './domain/interface/application/service/IBotService';

function start(): void {
  const botService = container.get<IBotService>(Types.BotService);
  botService.start();
}

start();
