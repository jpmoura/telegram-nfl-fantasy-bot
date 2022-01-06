import 'reflect-metadata';
import faker from 'faker';
import { mock } from 'jest-mock-extended';
import { Logger } from 'tslog';
import UpdateService from '../../../../src/application/service/update/UpdateService';
import INewsRepository from '../../../../src/domain/interface/infra/repository/news/INewsRepository';
import News from '../../../../src/domain/model/News';

describe('given a update service', () => {
  it('when a news updated is need then should retrieve the updated list of news', async () => {
    expect.hasAssertions();

    const fantasyTransactionRepository = mock<INewsRepository>();
    fantasyTransactionRepository.list.mockResolvedValue([mock<News>()]);
    const twitterRepository = mock<INewsRepository>();
    twitterRepository.list.mockResolvedValue([mock<News>()]);
    const rotowireRepository = mock<INewsRepository>();
    rotowireRepository.list.mockResolvedValue([mock<News>()]);
    const cut = new UpdateService(
      mock<Logger>(),
      fantasyTransactionRepository,
      twitterRepository,
      rotowireRepository,
    );

    const response = await cut.update(faker.date.recent());

    expect(fantasyTransactionRepository.list).toHaveBeenCalledTimes(1);
    expect(twitterRepository.list).toHaveBeenCalledTimes(1);
    expect(rotowireRepository.list).toHaveBeenCalledTimes(1);
    expect(response).toHaveLength(3);
  });
});
