import faker from 'faker';
import { mock } from 'jest-mock-extended';
import 'reflect-metadata';
import ChatService from '../../../../src/application/service/message/ChatService';
import IChatRepository from '../../../../src/domain/interface/infra/repository/message/IChatRepository';

describe('given a chat service', () => {
  it('when a chat is created then should persist it on internal list', async () => {
    expect.hasAssertions();

    const chatRepository = mock<IChatRepository>();
    const cut = new ChatService(chatRepository);

    await cut.create(faker.datatype.number());

    expect(chatRepository.insert).toHaveBeenCalledTimes(1);
  });

  it('when a chat is deleted then should remove it from internal list', async () => {
    expect.hasAssertions();

    const chatRepository = mock<IChatRepository>();
    const cut = new ChatService(chatRepository);

    await cut.delete(faker.datatype.number());

    expect(chatRepository.delete).toHaveBeenCalledTimes(1);
  });

  it.each([
    [[]],
    [[faker.datatype.number()]],
  ])('when a list of chats is needed and the current list is %p then should return the current list', async (expectedChatList: Array<number>) => {
    expect.hasAssertions();

    const chatRepository = mock<IChatRepository>();
    chatRepository.list.mockResolvedValue(expectedChatList);
    const cut = new ChatService(chatRepository);

    const response = await cut.list();

    expect(response).toStrictEqual(expectedChatList);
    expect(chatRepository.list).toHaveBeenCalledTimes(1);
  });
});
