import { ContainerModule, interfaces } from 'inversify';
import Types from '../cross-cutting/ioc/Types';
import IBotService from '../domain/interface/application/service/IBotService';
import ICommandService from '../domain/interface/application/service/interaction/ICommandService';
import IGlobalService from '../domain/interface/application/service/interaction/IGlobalService';
import IHearingService from '../domain/interface/application/service/interaction/IHearingService';
import IChatService from '../domain/interface/application/service/message/IChatService';
import IMessageService from '../domain/interface/application/service/message/IMessageService';
import IUpdateService from '../domain/interface/application/service/update/IUpdateService';
import BotService from './service/BotService';
import CommandService from './service/interaction/CommandService';
import GlobalService from './service/interaction/GlobalService';
import HearingService from './service/interaction/HearingService';
import ChatService from './service/message/ChatService';
import MessageService from './service/message/MessageService';
import UpdateService from './service/update/UpdateService';

const applicationModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IGlobalService>(Types.GlobalService).to(GlobalService);
  bind<ICommandService>(Types.CommandService).to(CommandService);
  bind<IMessageService>(Types.MessageService).to(MessageService);
  bind<IHearingService>(Types.HearingService).to(HearingService);
  bind<IUpdateService>(Types.UpdateService).to(UpdateService);
  bind<IChatService>(Types.ChatService).to(ChatService);
  bind<IBotService>(Types.BotService).to(BotService);
});

export default applicationModule;
