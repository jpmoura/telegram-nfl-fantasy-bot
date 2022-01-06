import faker from 'faker';
import { mock } from 'jest-mock-extended';
import 'reflect-metadata';
import MessageService from '../../../../src/application/service/message/MessageService';
import IMessageRepository from '../../../../src/domain/interface/infra/repository/message/IMessageRepository';
import News from '../../../../src/domain/model/News';

describe('given a message service', () => {
  it('when a message need to be sent than should send it to the chat', async () => {
    expect.hasAssertions();

    const messageRepository = mock<IMessageRepository>();
    const cut = new MessageService(messageRepository);

    await cut.send(faker.datatype.number(), mock<News>());

    expect(messageRepository.send).toHaveBeenCalledTimes(1);
  });
});
