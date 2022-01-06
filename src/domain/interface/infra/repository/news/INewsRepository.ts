import News from '../../../../model/News';

export default interface INewsRepository {
  list(): Promise<Array<News>>
}
